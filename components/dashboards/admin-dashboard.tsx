"use client";

import { useState } from "react";
import type { Subscription, PlatformSettings, VerificationRequest, User, Capper, Plan } from "@prisma/client";
import { formatCurrency } from "@/lib/format";

interface AdminDashboardProps {
  subscriptions: (Subscription & { capper: Capper & { user: User | null }; plan: Plan | null })[];
  settings: PlatformSettings | null;
  verificationQueue: (VerificationRequest & { user: User })[];
}

export default function AdminDashboard({ subscriptions, settings, verificationQueue }: AdminDashboardProps) {
  const [verifiedFee, setVerifiedFee] = useState(((settings?.verifiedFeeBps ?? 1500) / 100).toString());
  const [unverifiedFee, setUnverifiedFee] = useState(((settings?.unverifiedFeeBps ?? 2500) / 100).toString());
  const [message, setMessage] = useState<string | null>(null);

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.plan?.price ?? 0), 0);
  const revenueByCapper = subscriptions.reduce<Record<string, { name: string; amount: number }>>((acc, sub) => {
    const name = sub.capper.user?.name ?? "Capper";
    const existing = acc[sub.capperId];
    const amount = sub.plan?.price ?? 0;
    if (existing) {
      existing.amount += amount;
    } else {
      acc[sub.capperId] = { name, amount };
    }
    return acc;
  }, {});

  async function updateFees(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verifiedFee: Number(verifiedFee),
        unverifiedFee: Number(unverifiedFee)
      })
    });

    if (response.ok) {
      setMessage("Fee structure updated");
    } else {
      setMessage("Unable to update fees");
    }
  }

  async function approve(userId: string) {
    const response = await fetch("/api/admin/verify-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    setMessage(response.ok ? "Capper approved" : "Unable to approve");
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-white">Admin Console</h1>
        <p className="mt-2 text-sm text-slate-300">Monitor revenue, adjust platform fees, and approve capper verifications.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Platform revenue (est.)</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Active subscriptions</p>
          <p className="mt-2 text-2xl font-semibold text-white">{subscriptions.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Pending verifications</p>
          <p className="mt-2 text-2xl font-semibold text-white">{verificationQueue.length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Revenue by capper</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(revenueByCapper).map(([capperId, info]) => (
            <div key={capperId} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">{info.name}</p>
                <p className="text-xs text-slate-400">ID: {capperId}</p>
              </div>
              <p className="text-sm text-brand-200">{formatCurrency(info.amount)}</p>
            </div>
          ))}
          {Object.keys(revenueByCapper).length === 0 && <p className="text-sm text-slate-400">No revenue yet.</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Platform fees</h2>
        <form onSubmit={updateFees} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm text-slate-300">
            Verified fee %
            <input
              type="number"
              step="0.5"
              min="0"
              className="mt-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              value={verifiedFee}
              onChange={(e) => setVerifiedFee(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-sm text-slate-300">
            Unverified fee %
            <input
              type="number"
              step="0.5"
              min="0"
              className="mt-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              value={unverifiedFee}
              onChange={(e) => setUnverifiedFee(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="md:col-span-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
          >
            Update fees
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Verification queue</h2>
        <div className="mt-4 space-y-3">
          {verificationQueue.map((request) => (
            <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{request.user.name ?? request.user.email}</p>
                <p className="text-xs text-slate-400">{request.message || "No message"}</p>
              </div>
              <button
                onClick={() => approve(request.userId)}
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                Approve
              </button>
            </div>
          ))}
          {verificationQueue.length === 0 && <p className="text-sm text-slate-400">No pending requests.</p>}
        </div>
      </section>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
    </div>
  );
}
