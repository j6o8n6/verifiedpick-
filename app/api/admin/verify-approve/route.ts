import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  userId: z.string()
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

  await prisma.user.update({
    where: { id: result.data.userId },
    data: { isVerified: true }
  });

  await prisma.verificationRequest.updateMany({
    where: { userId: result.data.userId },
    data: { status: "APPROVED" }
  });

  return NextResponse.json({ success: true });
}
