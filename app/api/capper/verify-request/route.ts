import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  message: z.string().max(500).optional()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CAPPER") {
    return NextResponse.json({ error: "Only cappers can request verification" }, { status: 403 });
  }

  const json = await request.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const requestRecord = await prisma.verificationRequest.upsert({
    where: { userId: session.user.id },
    update: { message: result.data.message ?? null, status: "PENDING" },
    create: {
      userId: session.user.id,
      message: result.data.message
    }
  });

  return NextResponse.json({ request: requestRecord });
}
