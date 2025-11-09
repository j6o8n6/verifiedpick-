export type Capper = {
  id: string;
  name: string;
  avatar: string;
  sports: string[];
  winRate: number;
  roi: number;
  record: string;
  featured: boolean;
};

export const CAPPERS: Capper[] = [
  {
    id: "cap-1",
    name: "SharpSavage",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sharp",
    sports: ["NFL", "NBA"],
    winRate: 62,
    roi: 18.4,
    record: "155-95-6",
    featured: true
  },
  {
    id: "cap-2",
    name: "LineWhisperer",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=line",
    sports: ["MLB", "NHL"],
    winRate: 58,
    roi: 12.2,
    record: "201-145-4",
    featured: true
  },
  {
    id: "cap-3",
    name: "UnderdogAlly",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=ally",
    sports: ["NCAAF", "NFL"],
    winRate: 65,
    roi: 22.9,
    record: "88-47-3",
    featured: true
  },
  {
    id: "cap-4",
    name: "TotalsGuru",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=guru",
    sports: ["NBA"],
    winRate: 60,
    roi: 14.6,
    record: "130-86-5",
    featured: false
  }
];

export type CapperPlan = {
  id: string;
  name: string;
  price: number;
  period: "day" | "week" | "month";
  perks: string[];
};

export const CAPPER_PLANS: Record<string, CapperPlan[]> = {
  "cap-1": [
    { id: "p-1d", name: "Daily", price: 10, period: "day", perks: ["Today’s picks", "Email alert"] },
    { id: "p-1w", name: "Weekly", price: 39, period: "week", perks: ["All week access", "Priority alerts"] },
    { id: "p-1m", name: "Monthly", price: 95, period: "month", perks: ["Full month", "Performance recap"] }
  ],
  "cap-2": [
    { id: "p-2d", name: "Daily", price: 8, period: "day", perks: ["Today’s picks"] },
    { id: "p-2w", name: "Weekly", price: 35, period: "week", perks: ["All week", "Basic stats"] }
  ],
  "cap-3": [
    { id: "p-3w", name: "Weekly", price: 45, period: "week", perks: ["NCAAF/NFL", "Discord ping"] },
    { id: "p-3m", name: "Monthly", price: 99, period: "month", perks: ["Full access", "Sunday deep-dive"] }
  ],
  "cap-4": [
    { id: "p-4d", name: "Daily", price: 9, period: "day", perks: ["NBA totals today"] },
    { id: "p-4m", name: "Monthly", price: 89, period: "month", perks: ["Full month", "DM support"] }
  ]
};

export type PickPreview = {
  id: string;
  capperId: string;
  sport: string;
  league: string;
  event: string;
  line: string;
  confidence: number;
  locked: boolean;
};

export const PICKS: PickPreview[] = [
  { id: "pk1", capperId: "cap-1", sport: "NFL", league: "NFL", event: "Eagles @ Cowboys", line: "PHI -2.5", confidence: 4, locked: true },
  { id: "pk2", capperId: "cap-2", sport: "NBA", league: "NBA", event: "Celtics @ Heat", line: "BOS TT Over 112.5", confidence: 3, locked: true },
  { id: "pk3", capperId: "cap-3", sport: "NCAAF", league: "NCAAF", event: "Oregon @ USC", line: "ORE -6.5", confidence: 5, locked: true }
];

export const CAPPER_REVENUE: Record<string, number> = {
  "cap-1": 12450,
  "cap-2": 8450,
  "cap-3": 15200,
  "cap-4": 6100
};

export type LeaderboardEntry = { id: string; roi: number };

export function computeLeaderboard<T extends LeaderboardEntry>(cappers: T[]): T[] {
  return [...cappers].sort((a, b) => b.roi - a.roi);
}

(function tests() {
  const ranked = computeLeaderboard(CAPPERS);
  console.assert(ranked.length === CAPPERS.length, "Leaderboard length mismatch");
  const maxROI = Math.max(...CAPPERS.map((c) => c.roi));
  console.assert(ranked[0].roi === maxROI, "Top ROI is not first in leaderboard");

  const snapshot = CAPPERS.map((c) => c.id).join(",");
  computeLeaderboard(CAPPERS);
  console.assert(
    CAPPERS.map((c) => c.id).join(",") === snapshot,
    "computeLeaderboard mutated input"
  );

  const ties = [
    { id: "a", roi: 10 },
    { id: "b", roi: 10 },
    { id: "c", roi: 5 }
  ];
  const tiedRanked = computeLeaderboard(ties);
  console.assert(
    tiedRanked[0].roi === 10 &&
      tiedRanked[1].roi === 10 &&
      tiedRanked[2].roi === 5,
    "Tie handling failed"
  );
})();

export type FinanceRow = {
  id: string;
  name: string;
  gross: number;
  platformShare: number;
  capperNet: number;
};

export function computeFinance(
  rows: { id: string; name: string; gross: number }[],
  platformCutPct: number
): { rows: FinanceRow[]; totals: { gross: number; platform: number; capper: number } } {
  const rate = platformCutPct / 100;
  const withShares: FinanceRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    gross: r.gross,
    platformShare: Math.round(r.gross * rate),
    capperNet: Math.round(r.gross * (1 - rate))
  }));

  const totals = withShares.reduce(
    (acc, r) => {
      acc.gross += r.gross;
      acc.platform += r.platformShare;
      acc.capper += r.capperNet;
      return acc;
    },
    { gross: 0, platform: 0, capper: 0 }
  );

  return { rows: withShares, totals };
}

(function financeTests() {
  const rows = Object.entries(CAPPER_REVENUE).map(([id, gross]) => ({
    id,
    name: CAPPERS.find((c) => c.id === id)?.name || id,
    gross
  }));
  const cut = 15;
  const { rows: r, totals } = computeFinance(rows, cut);
  console.assert(totals.gross === r.reduce((s, x) => s + x.gross, 0), "Finance: gross total mismatch");
  console.assert(totals.platform === r.reduce((s, x) => s + x.platformShare, 0), "Finance: platform total mismatch");
  console.assert(totals.capper === r.reduce((s, x) => s + x.capperNet, 0), "Finance: capper total mismatch");
})();

export function formatUSD(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
}
