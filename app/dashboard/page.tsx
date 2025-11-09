import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BettorDashboard from "@/components/dashboards/bettor-dashboard";
import CapperDashboard from "@/components/dashboards/capper-dashboard";
import Tabs from "@/components/tabs";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [subscriptions, capper] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: session.user.id, active: true },
      include: {
        capper: {
          include: { user: true }
        },
        plan: true
      }
    }),
    session.user.role !== "CAPPER"
      ? null
      : prisma.capper.findUnique({
          where: { userId: session.user.id },
          include: {
            user: true,
            plans: true,
            picks: {
              orderBy: { createdAt: "desc" }
            }
          }
        })
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Manage subscriptions, publish picks, and track performance from a single workspace.
        </p>
      </header>

      <Tabs
        tabs={[
          {
            id: "bettor",
            title: "Bettor Dashboard",
            content: <BettorDashboard subscriptions={subscriptions} />
          },
          {
            id: "capper",
            title: "Capper Dashboard",
            disabled: session.user.role !== "CAPPER",
            content: <CapperDashboard capper={capper} />
          }
        ]}
      />
    </div>
  );
}
