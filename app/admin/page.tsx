import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/dashboards/admin-dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [subscriptions, settings, verificationQueue] = await Promise.all([
    prisma.subscription.findMany({
      where: { active: true },
      include: {
        capper: { include: { user: true } },
        plan: true
      }
    }),
    prisma.platformSettings.findUnique({ where: { id: 1 } }),
    prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: { user: true }
    })
  ]);

  return (
    <AdminDashboard subscriptions={subscriptions} settings={settings} verificationQueue={verificationQueue} />
  );
}
