import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPercentage } from "@/lib/format";

export const revalidate = 0;

export default async function CappersPage() {
  const cappers = await prisma.capper.findMany({
    include: {
      user: true,
      plans: true
    }
  });

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-white">Discover cappers</h1>
        <p className="mt-3 text-sm text-slate-300">
          Browse every verified and emerging capper on VerifiedPicks. Subscribe to unlock premium picks instantly after
          checkout.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {cappers.map((capper) => (
          <Link
            key={capper.id}
            href={`/cappers/${capper.id}`}
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-brand-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{capper.user?.name ?? "Unnamed Capper"}</h2>
                <p className="text-xs uppercase tracking-wide text-slate-400">{capper.user?.isVerified ? "Verified" : "Pending Verification"}</p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>Win rate: {formatPercentage(capper.winRate)}</p>
                <p>ROI: {formatPercentage(capper.roi)}</p>
                <p>Record: {capper.record}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300 line-clamp-3">{capper.bio || "No bio provided yet."}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {capper.plans.map((plan) => (
                <span key={plan.id} className="rounded-full border border-brand-500/60 px-3 py-1 text-xs uppercase tracking-wide text-brand-200">
                  {plan.name} · ${(plan.price / 100).toFixed(2)} / {plan.interval}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {cappers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center text-slate-400">
            No cappers yet—be the first to onboard and monetize your picks.
          </div>
        )}
      </div>
    </div>
  );
}
