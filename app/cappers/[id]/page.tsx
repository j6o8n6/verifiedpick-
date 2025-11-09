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
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:col-span-2">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                {capper.user?.isVerified ? "Verified Capper" : "Awaiting verification"}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">{capper.user?.name ?? "Capper"}</h1>
              <p className="text-sm text-gray-600">{capper.bio || "This capper hasn\'t written a bio yet."}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 text-sm">
                <div className="text-xs text-gray-500">Win rate</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{formatPercentage(capper.winRate)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm">
                <div className="text-xs text-gray-500">ROI</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{formatPercentage(capper.roi)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm">
                <div className="text-xs text-gray-500">Record</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{capper.record}</div>
              </div>
            </div>
            {capper.sports.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {capper.sports.map((sport) => (
                  <span key={sport} className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    {sport}
                  </span>
                ))}
              </div>
            )}
          </div>
          <aside className="space-y-4">
            {capper.plans.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                This capper hasn&apos;t published subscription plans yet.
              </div>
            )}
            {capper.plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                  <span className="text-xs uppercase tracking-wide text-gray-500">{plan.interval}</span>
                </div>
                <p className="mt-2 text-2xl font-black text-gray-900">{formatCurrency(plan.price)}</p>
                <SubscribeButton planId={plan.id} className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700" />
              </div>
            ))}
          </aside>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent picks</h2>
            <span className="text-sm text-gray-500">Latest {Math.min(capper.picks.length, 5)} plays</span>
          </div>
          <div className="space-y-4">
            {capper.picks.map((pick) => (
              <article key={pick.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pick.event}</h3>
                    <p className="text-sm text-gray-600">{pick.sport} · {pick.line}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Confidence: {pick.confidence}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-700">{pick.analysis}</p>
                <p className="mt-3 text-xs text-gray-500">Posted {pick.createdAt.toLocaleString()}</p>
              </article>
            ))}
            {capper.picks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                No picks yet. Subscribe to get alerts the moment picks are published.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
