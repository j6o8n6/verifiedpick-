import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const capperId = searchParams.get("capperId");

  if (!capperId) {
    return NextResponse.json({ error: "Missing capperId" }, { status: 400 });
  }

  const picks = await prisma.pick.findMany({
    where: { capperId },
    orderBy: { createdAt: "desc" }
  });

  if (!session?.user) {
    return NextResponse.json({
      picks: picks.map((pick) => ({
        ...pick,
        analysis: "Subscribe to unlock full analysis"
      }))
    });
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      capperId,
      active: true
    }
  });

  if (!subscription) {
    return NextResponse.json({
      picks: picks.map((pick) => ({
        ...pick,
        analysis: "Subscribe to unlock full analysis"
      }))
    });
  }

  return NextResponse.json({ picks });
}
