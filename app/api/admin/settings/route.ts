import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  verifiedFee: z.number().min(0).max(100),
  unverifiedFee: z.number().min(0).max(100)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { verifiedFee, unverifiedFee } = result.data;

  const settings = await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: {
      verifiedFeeBps: Math.round(verifiedFee * 100),
      unverifiedFeeBps: Math.round(unverifiedFee * 100)
    },
    create: {
      id: 1,
      verifiedFeeBps: Math.round(verifiedFee * 100),
      unverifiedFeeBps: Math.round(unverifiedFee * 100)
    }
  });

  return NextResponse.json({ settings });
}
