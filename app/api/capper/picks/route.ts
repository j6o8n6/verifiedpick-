import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  event: z.string().min(2),
  line: z.string().min(2),
  sport: z.string().min(2),
  confidence: z.string().min(1),
  analysis: z.string().min(10)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CAPPER") {
    return NextResponse.json({ error: "Only cappers can publish picks" }, { status: 403 });
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

  const pick = await prisma.pick.create({
    data: {
      capperId: capper.id,
      ...result.data
    }
  });

  return NextResponse.json({ pick });
}
