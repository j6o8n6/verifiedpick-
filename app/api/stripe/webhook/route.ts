import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string | undefined;
      const userId = session.metadata?.userId;
      const capperId = session.metadata?.capperId;
      const planId = session.metadata?.planId;

      if (subscriptionId && userId && capperId) {
        await prisma.subscription.upsert({
          where: { stripeSubId: subscriptionId },
          create: {
            stripeSubId: subscriptionId,
            userId,
            capperId,
            planId,
            active: true
          },
          update: {
            active: true,
            planId
          }
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const capperId = subscription.metadata?.capperId;
      const planId = subscription.metadata?.planId;
      const active = subscription.status === "active" || subscription.status === "trialing";

      if (subscription.id && userId && capperId) {
        await prisma.subscription.upsert({
          where: { stripeSubId: subscription.id },
          create: {
            stripeSubId: subscription.id,
            userId,
            capperId,
            planId,
            active
          },
          update: {
            active,
            planId
          }
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
