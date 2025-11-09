"use client";

import { useState } from "react";
import type { Capper, Plan, Pick, User } from "@prisma/client";
import { formatCurrency } from "@/lib/format";

interface CapperDashboardProps {
  capper: (Capper & { plans: Plan[]; picks: Pick[]; user: User | null }) | null;
}

const intervals = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" }
] as const;

export default function CapperDashboard({ capper }: CapperDashboardProps) {
  const [planForm, setPlanForm] = useState({ name: "", price: "", interval: "month" });
  const [pickForm, setPickForm] = useState({ event: "", line: "", sport: "", confidence: "", analysis: "" });
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingPick, setLoadingPick] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [requestingVerification, setRequestingVerification] = useState(false);

  async function submitPlan(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPlan(true);
    setMessage(null);

    const response = await fetch("/api/capper/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...planForm, price: Number(planForm.price) * 100 })
    });

    setLoadingPlan(false);
    if (!response.ok) {
      setMessage("Unable to create plan");
      return;
    }

    setPlanForm({ name: "", price: "", interval: "month" });
    setMessage("Plan created. Refresh to view.");
  }

  async function submitPick(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPick(true);
    setMessage(null);

    const response = await fetch("/api/capper/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pickForm)
    });

    setLoadingPick(false);
    if (!response.ok) {
      setMessage("Unable to publish pick");
      return;
    }

    setPickForm({ event: "", line: "", sport: "", confidence: "", analysis: "" });
    setMessage("Pick published. Subscribers will be notified via webhook integration.");
  }

  async function requestVerification() {
    setRequestingVerification(true);
    setMessage(null);
    const response = await fetch("/api/capper/verify-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    setRequestingVerification(false);
    setMessage(response.ok ? "Verification request sent" : "Unable to submit request");
  }

  if (!capper) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
        You&apos;re registered as a bettor. Upgrade to a capper account to publish picks and earn subscription revenue.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Your plans</h2>
        <div className="mt-2 text-xs uppercase tracking-wide text-slate-400">
          Status: {capper.user?.isVerified ? "Verified" : "Unverified"}
        </div>
        {!capper.user?.isVerified && (
          <button
            onClick={requestVerification}
            disabled={requestingVerification}
            className="mt-4 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-200 hover:bg-brand-500/10 disabled:cursor-not-allowed disabled:border-brand-500/50"
          >
            {requestingVerification ? "Submitting…" : "Request verification"}
          </button>
        )}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {capper.plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5">
              <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-200">
                {formatCurrency(plan.price)} / {plan.interval}
              </p>
            </div>
          ))}
          {capper.plans.length === 0 && <p className="text-sm text-slate-400">No plans yet.</p>}
        </div>
        <form onSubmit={submitPlan} className="mt-6 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Plan name"
            value={planForm.name}
            onChange={(e) => setPlanForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Price (USD)"
            type="number"
            value={planForm.price}
            onChange={(e) => setPlanForm((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
          <select
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            value={planForm.interval}
            onChange={(e) => setPlanForm((prev) => ({ ...prev, interval: e.target.value }))}
          >
            {intervals.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loadingPlan}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/60 md:col-span-3"
          >
            {loadingPlan ? "Creating…" : "Create plan"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Publish a pick</h2>
        <form onSubmit={submitPick} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Event"
            value={pickForm.event}
            onChange={(e) => setPickForm((prev) => ({ ...prev, event: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Line"
            value={pickForm.line}
            onChange={(e) => setPickForm((prev) => ({ ...prev, line: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Sport"
            value={pickForm.sport}
            onChange={(e) => setPickForm((prev) => ({ ...prev, sport: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Confidence"
            value={pickForm.confidence}
            onChange={(e) => setPickForm((prev) => ({ ...prev, confidence: e.target.value }))}
            required
          />
          <textarea
            className="md:col-span-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            placeholder="Analysis"
            rows={4}
            value={pickForm.analysis}
            onChange={(e) => setPickForm((prev) => ({ ...prev, analysis: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={loadingPick}
            className="md:col-span-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/60"
          >
            {loadingPick ? "Publishing…" : "Publish pick"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Recent picks</h2>
        <div className="mt-4 space-y-3">
          {capper.picks.map((pick) => (
            <div key={pick.id} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <h3 className="text-sm font-semibold text-white">{pick.event}</h3>
              <p className="text-xs text-slate-400">{pick.sport} · {pick.line}</p>
              <p className="mt-2 text-sm text-slate-300">{pick.analysis}</p>
            </div>
          ))}
          {capper.picks.length === 0 && <p className="text-sm text-slate-400">No picks published yet.</p>}
        </div>
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
    </div>
  );
}
