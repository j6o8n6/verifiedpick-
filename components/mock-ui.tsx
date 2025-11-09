"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CAPPERS,
  CAPPER_PLANS,
  PICKS,
  CAPPER_REVENUE,
  computeLeaderboard,
  computeFinance,
  formatUSD,
  type Capper
} from "@/lib/mock-data";

type SelectCapperHandler = (capper: Capper) => void;

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      {children}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-12 md:grid-cols-2 md:pb-24 md:pt-20">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Forge Your Wins
            <span className="block text-emerald-600">with VerifiedPicks</span>
          </h1>
          <p className="mt-4 max-w-xl text-gray-600">
            Subscribe directly to individual cappers. Each expert sets their own prices. You get members-only access to their picks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cappers" className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-900">
              Browse Cappers
            </Link>
            <Link href="/how-it-works" className="rounded-xl border border-gray-300 px-4 py-2 hover:bg-white">
              How It Works
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <Badge>Verified win rates</Badge>
            <Badge>Direct-to-capper</Badge>
            <Badge>Members-only picks</Badge>
          </div>
        </div>
        <div className="relative">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Live Pick Feed</h3>
              <span className="text-xs text-gray-500">Preview</span>
            </div>
            <div className="space-y-3">
              {PICKS.map((p) => (
                <div key={p.id} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{p.event}</div>
                    <Badge>{p.sport}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{p.line}</div>
                  <div className="mt-2 text-xs text-gray-500">Confidence: {"⭐".repeat(p.confidence)}</div>
                  <div className="mt-3 rounded-lg bg-gray-100 p-2 text-xs text-gray-500">
                    Locked — subscribe to this capper to unlock analysis
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SearchBar({ value, setValue }: { value: string; setValue: (value: string) => void }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search cappers, sports…"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm outline-none ring-emerald-200 focus:ring"
      />
      <svg className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
}

export function CapperCard({ capper, onOpen }: { capper: Capper; onOpen: SelectCapperHandler }) {
  return (
    <button
      onClick={() => onOpen(capper)}
      className="group flex w-full flex-col items-start rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={capper.avatar} alt={capper.name} className="h-10 w-10 rounded-full" />
          <div>
            <div className="font-semibold group-hover:text-emerald-700">{capper.name}</div>
            <div className="text-xs text-gray-500">{capper.sports.join(" • ")}</div>
          </div>
        </div>
        {capper.featured && <Badge>Featured</Badge>}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Stat label="Win Rate" value={`${capper.winRate}%`} />
        <Stat label="ROI" value={`${capper.roi}%`} />
        <Stat label="Record" value={capper.record} />
      </div>
      <div className="mt-4 flex w-full items-center justify-between">
        <div className="text-xs text-gray-500">Verified stats, updated nightly</div>
        <span className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">View Plans</span>
      </div>
    </button>
  );
}

export function FeaturedCappers({ onOpen }: { onOpen: SelectCapperHandler }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      CAPPERS.filter((capper) =>
        [capper.name, ...capper.sports].join(" ").toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Featured Cappers</h2>
          <p className="text-sm text-gray-600">Subscribe directly to experts. Prices set by each capper.</p>
        </div>
        <div className="w-full max-w-sm">
          <SearchBar value={query} setValue={setQuery} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((capper) => (
          <CapperCard key={capper.id} capper={capper} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

export function TopROIWidget({ onOpen }: { onOpen: SelectCapperHandler }) {
  const top = useMemo(() => computeLeaderboard(CAPPERS).slice(0, 3), []);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Top ROI This Week</h3>
          <Link className="text-xs font-medium text-emerald-700 hover:underline" href="/leaderboard">
            See leaderboard →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {top.map((capper, index) => (
            <button
              key={capper.id}
              onClick={() => onOpen(capper)}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">#{index + 1}</div>
                <img src={capper.avatar} className="h-8 w-8 rounded-full" alt={capper.name} />
                <div>
                  <div className="text-sm font-medium">{capper.name}</div>
                  <div className="text-xs text-gray-500">{capper.sports.join(" • ")}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-700">{capper.roi}% ROI</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-bold">How VerifiedPicks Works</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-gray-700">
          <li>Browse expert cappers and check their verified stats.</li>
          <li>
            Open a capper profile to view their <strong>own pricing</strong> (daily/weekly/monthly).
          </li>
          <li>Subscribe to that capper to unlock their members-only picks.</li>
          <li>Manage your subscriptions in your Bettor Dashboard.</li>
        </ol>
        <p className="mt-6 text-xs text-gray-500">Picks are for informational/entertainment purposes only. 21+.</p>
      </div>
    </section>
  );
}

export function CapperModal({
  open,
  onClose,
  capper
}: {
  open: boolean;
  onClose: () => void;
  capper: Capper | null;
}) {
  if (!open || !capper) return null;

  const plans = CAPPER_PLANS[capper.id] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 p-0 md:p-8" onClick={onClose}>
      <div
        className="ml-auto h-full w-full max-w-md overflow-y-auto bg-white md:ml-0 md:h-auto md:max-w-4xl md:rounded-2xl md:shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 md:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <img src={capper.avatar} className="h-10 w-10 rounded-full" alt={capper.name} />
            <div>
              <div className="text-base font-semibold">{capper.name}</div>
              <div className="text-xs text-gray-500">{capper.sports.join(" • ")}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 px-5 py-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Win Rate" value={`${capper.winRate}%`} />
              <Stat label="ROI" value={`${capper.roi}%`} />
              <Stat label="Record" value={capper.record} />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold">Recent Picks (locked preview)</h4>
              <div className="mt-2 space-y-2">
                {PICKS.filter((pick) => pick.capperId === capper.id)
                  .concat(PICKS.slice(0, 1))
                  .slice(0, 3)
                  .map((pick) => (
                    <div key={pick.id} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">{pick.event}</div>
                        <Badge>{pick.sport}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">{pick.line}</div>
                      <div className="mt-2 rounded-lg bg-gray-100 p-2 text-xs text-gray-500">Subscribe to unlock analysis</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <aside className="md:col-span-1">
            <h4 className="text-sm font-semibold">Subscribe to {capper.name}</h4>
            <div className="mt-3 space-y-3">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-xl border border-gray-200 p-4">
                  <div>
                    <div className="text-sm font-semibold">{plan.name}</div>
                    <div className="mt-1 text-2xl font-black">
                      ${plan.price}
                      <span className="ml-1 align-top text-xs font-medium text-gray-500">/ {plan.period}</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {plan.perks.map((perk, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                    Subscribe
                  </button>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
                  This capper has not published plans yet.
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-500">Secure checkout • Cancel anytime</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function BrowseCappers({ onOpen }: { onOpen: SelectCapperHandler }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      CAPPERS.filter((capper) =>
        [capper.name, ...capper.sports].join(" ").toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-bold">Browse Cappers</h1>
      <div className="mt-4 max-w-md">
        <SearchBar value={query} setValue={setQuery} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((capper) => (
          <CapperCard key={capper.id} capper={capper} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

export function LeaderboardTable({ onOpen }: { onOpen?: SelectCapperHandler }) {
  const ranked = useMemo(() => computeLeaderboard(CAPPERS), []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-gray-600">Ranked by ROI (return on investment). Higher is better.</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Capper</th>
              <th className="px-4 py-3">Sports</th>
              <th className="px-4 py-3">Win Rate</th>
              <th className="px-4 py-3">ROI</th>
              <th className="px-4 py-3">Record</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ranked.map((capper, index) => (
              <tr key={capper.id} className="border-t">
                <td className="px-4 py-3 font-semibold">#{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={capper.avatar} className="h-8 w-8 rounded-full" alt={capper.name} />
                    <div className="font-medium">{capper.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{capper.sports.join(" • ")}</td>
                <td className="px-4 py-3">{capper.winRate}%</td>
                <td className="px-4 py-3 font-semibold text-emerald-700">{capper.roi}%</td>
                <td className="px-4 py-3">{capper.record}</td>
                <td className="px-4 py-3 text-right">
                  {onOpen && (
                    <button
                      onClick={() => onOpen(capper)}
                      className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
                    >
                      View Plans
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DashboardShell() {
  const [tab, setTab] = useState<"bettor" | "capper">("bettor");

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab("bettor")}
            className={`rounded-lg px-3 py-1 text-sm ${tab === "bettor" ? "bg-white shadow" : ""}`}
          >
            Bettor
          </button>
          <button
            onClick={() => setTab("capper")}
            className={`rounded-lg px-3 py-1 text-sm ${tab === "capper" ? "bg-white shadow" : ""}`}
          >
            Capper
          </button>
        </div>
      </div>

      {tab === "bettor" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2">
            <h3 className="text-sm font-semibold">Unlocked Picks</h3>
            <div className="mt-3 grid gap-3">
              {PICKS.map((pick) => (
                <div key={pick.id} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{pick.event}</div>
                    <Badge>{pick.sport}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">{pick.line}</div>
                  <div className="mt-2 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800">Full analysis (mock)</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Your Subscriptions</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>SharpSavage — Weekly — Renews Nov 28</li>
              <li>TotalsGuru — Monthly — Renews Dec 8</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2">
            <h3 className="text-sm font-semibold">Post a Pick</h3>
            <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Event (e.g., Eagles @ Cowboys)" />
              <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Line (e.g., PHI -2.5)" />
              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>NFL</option>
                <option>NBA</option>
                <option>MLB</option>
              </select>
              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>Confidence ⭐⭐⭐</option>
                <option>⭐⭐</option>
                <option>⭐⭐⭐⭐⭐</option>
              </select>
              <textarea className="h-28 rounded-lg border px-3 py-2 text-sm md:col-span-2" placeholder="Short analysis…" />
              <button className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 md:col-span-2">
                Publish (mock)
              </button>
            </form>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Stats (mock)</h3>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-2xl font-black">62%</div>
                <div className="text-xs text-gray-500">Win Rate</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-2xl font-black">18.4%</div>
                <div className="text-xs text-gray-500">ROI</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-2xl font-black">155-95-6</div>
                <div className="text-xs text-gray-500">Record</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function AdminDashboardShell() {
  const [platformCut, setPlatformCut] = useState(15);

  const rowsBase = useMemo(
    () =>
      Object.entries(CAPPER_REVENUE).map(([id, gross]) => ({
        id,
        name: CAPPERS.find((capper) => capper.id === id)?.name || id,
        gross
      })),
    []
  );

  const { rows, totals } = useMemo(() => computeFinance(rowsBase, platformCut), [rowsBase, platformCut]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Owner Console</h1>
          <p className="text-sm text-gray-600">Confidential overview of revenue and platform cut.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-sm font-medium">
            Platform Cut: <span className="font-bold">{platformCut}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={platformCut}
            onChange={(event) => setPlatformCut(parseInt(event.target.value, 10))}
            className="mt-2 w-64"
          />
          <div className="mt-1 text-xs text-gray-500">Slide to simulate fee changes (frontend only).</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs text-gray-500">Monthly Gross</div>
          <div className="mt-1 text-3xl font-black">{formatUSD(totals.gross)}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs text-gray-500">Your Share ({platformCut}%)</div>
          <div className="mt-1 text-3xl font-black text-emerald-700">{formatUSD(totals.platform)}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs text-gray-500">Paid to Cappers</div>
          <div className="mt-1 text-3xl font-black">{formatUSD(totals.capper)}</div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Capper</th>
              <th className="px-4 py-3">Gross</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Capper Net</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={CAPPERS.find((capper) => capper.id === row.id)?.avatar} className="h-8 w-8 rounded-full" alt={row.name} />
                    <div className="font-medium">{row.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{formatUSD(row.gross)}</td>
                <td className="px-4 py-3 font-semibold text-emerald-700">{formatUSD(row.platformShare)}</td>
                <td className="px-4 py-3">{formatUSD(row.capperNet)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-gray-50">
              <td className="px-4 py-3 font-semibold">Totals</td>
              <td className="px-4 py-3 font-semibold">{formatUSD(totals.gross)}</td>
              <td className="px-4 py-3 font-semibold text-emerald-700">{formatUSD(totals.platform)}</td>
              <td className="px-4 py-3 font-semibold">{formatUSD(totals.capper)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
