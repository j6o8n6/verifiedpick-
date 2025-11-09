"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Subscription, Capper, User, Plan } from "@prisma/client";

interface BettorSubscription extends Subscription {
  capper: Capper & { user: User | null };
  plan: Plan | null;
}

interface BettorDashboardProps {
  subscriptions: BettorSubscription[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BettorDashboard({ subscriptions }: BettorDashboardProps) {
  const [selectedCapper, setSelectedCapper] = useState<string | null>(subscriptions[0]?.capperId ?? null);
  const { data } = useSWR(selectedCapper ? `/api/picks?capperId=${selectedCapper}` : null, fetcher);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Active subscriptions</h2>
        <div className="mt-4 space-y-3">
          {subscriptions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedCapper(sub.capperId)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                selectedCapper === sub.capperId ? "border-brand-500 bg-brand-500/10" : "border-slate-800 bg-slate-900"
              }`}
            >
              <div>
                <p className="font-medium text-white">{sub.capper.user?.name ?? "Capper"}</p>
                <p className="text-xs text-slate-400">
                  {sub.plan ? `${sub.plan.name} · $${(sub.plan.price / 100).toFixed(2)}` : "Custom plan"}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-brand-200">Active</span>
            </button>
          ))}
          {subscriptions.length === 0 && <p className="text-sm text-slate-400">No active subscriptions.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Unlocked picks</h2>
        <div className="mt-4 space-y-3">
          {data?.picks?.map((pick: any) => (
            <article key={pick.id} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>
                  {pick.event} · {pick.line}
                </span>
                <span className="text-brand-200">{pick.confidence}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{pick.analysis}</p>
            </article>
          ))}
          {selectedCapper && (!data || data.picks?.length === 0) && (
            <p className="text-sm text-slate-400">No picks released yet. You&apos;ll see them here instantly.</p>
          )}
          {!selectedCapper && <p className="text-sm text-slate-400">Select a subscription to view picks.</p>}
        </div>
      </div>
    </div>
  );
}
