import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPercentage } from "@/lib/format";
import SubscribeButton from "@/components/subscribe-button";

interface CapperPageProps {
  params: { id: string };
}

export default async function CapperPage({ params }: CapperPageProps) {
  const capper = await prisma.capper.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      plans: true,
      picks: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (!capper) return notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{capper.user?.name ?? "Capper"}</h1>
          <p className="mt-2 text-sm text-brand-300">{capper.user?.isVerified ? "Verified Capper" : "Awaiting verification"}</p>
          <p className="mt-4 max-w-2xl text-sm text-slate-300">{capper.bio || "This capper hasn\'t written a bio yet."}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-200">
            <span>Win rate: {formatPercentage(capper.winRate)}</span>
            <span>ROI: {formatPercentage(capper.roi)}</span>
            <span>Record: {capper.record}</span>
          </div>
          {capper.sports.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
              {capper.sports.map((sport) => (
                <span key={sport} className="rounded-full border border-slate-700 px-3 py-1">
                  {sport}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="w-full max-w-sm space-y-4">
          {capper.plans.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-400">
              This capper hasn&apos;t published subscription plans yet.
            </div>
          )}
          {capper.plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-6">
              <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-200">
                {formatCurrency(plan.price)} / {plan.interval}
              </p>
              <SubscribeButton planId={plan.id} className="mt-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Recent picks</h2>
        <div className="space-y-4">
          {capper.picks.map((pick) => (
            <article key={pick.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{pick.event}</h3>
                  <p className="text-sm text-slate-300">{pick.sport} · {pick.line}</p>
                </div>
                <div className="text-sm text-brand-200">Confidence: {pick.confidence}</div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{pick.analysis}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Posted {pick.createdAt.toLocaleString()}</p>
            </article>
          ))}
          {capper.picks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-slate-400">
              No picks yet. Subscribe to get alerts the moment picks are published.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
