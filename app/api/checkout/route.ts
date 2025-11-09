import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateApplicationFee, PLATFORM_FEE_DEFAULTS, stripe } from "@/lib/stripe";

const schema = z.object({
  planId: z.string()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const plan = await prisma.plan.findUnique({
    where: { id: result.data.planId },
    include: {
      capper: {
        include: { user: true }
      }
    }
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (!plan.capper.user?.stripeAccountId) {
    return NextResponse.json({ error: "Capper has not completed payouts setup" }, { status: 400 });
  }

  const settings = await prisma.platformSettings.findUnique({ where: { id: 1 } });
  const feeBps = plan.capper.user.isVerified
    ? settings?.verifiedFeeBps ?? PLATFORM_FEE_DEFAULTS.verifiedBps
    : settings?.unverifiedFeeBps ?? PLATFORM_FEE_DEFAULTS.unverifiedBps;

  const applicationFee = calculateApplicationFee(plan.price, feeBps);

  const successUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/dashboard?checkout=success`;
  const cancelUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/cappers/${plan.capperId}?checkout=cancel`;

  const customerId = await getOrCreateCustomer(session.user.id, session.user.email);

  const sessionStripe = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: plan.price,
          recurring: { interval: plan.interval },
          product_data: {
            name: `${plan.capper.user?.name ?? "Capper"} · ${plan.name}`
          }
        },
        quantity: 1
      }
    ],
    subscription_data: {
      metadata: {
        capperId: plan.capperId,
        userId: session.user.id,
        planId: plan.id
      }
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: {
      application_fee_amount: applicationFee,
      transfer_data: {
        destination: plan.capper.user.stripeAccountId
      }
    },
    metadata: {
      planId: plan.id,
      capperId: plan.capperId,
      userId: session.user.id
    }
  });

  return NextResponse.json({ url: sessionStripe.url });
}

async function getOrCreateCustomer(userId: string, email?: string | null) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    name: user.name ?? undefined,
    metadata: { userId: user.id }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id }
  });

  return customer.id;
}
