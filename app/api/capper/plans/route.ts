import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  price: z.number().int().min(100),
  interval: z.enum(["day", "week", "month"])
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CAPPER") {
    return NextResponse.json({ error: "Only cappers can create plans" }, { status: 403 });
  }

  const json = await request.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const capper = await prisma.capper.findUnique({ where: { userId: session.user.id } });
  if (!capper) {
    return NextResponse.json({ error: "Capper profile not found" }, { status: 404 });
  }

  const plan = await prisma.plan.create({
    data: {
      capperId: capper.id,
      name: result.data.name,
      price: result.data.price,
      interval: result.data.interval
    }
  });

  return NextResponse.json({ plan });
}
