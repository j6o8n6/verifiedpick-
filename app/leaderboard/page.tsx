"use client";

import { useState } from "react";
import { LeaderboardTable, CapperModal } from "@/components/mock-ui";
import type { Capper } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const [selectedCapper, setSelectedCapper] = useState<Capper | null>(null);

  return (
    <>
      <LeaderboardTable onOpen={(capper) => setSelectedCapper(capper)} />
      <CapperModal open={Boolean(selectedCapper)} capper={selectedCapper} onClose={() => setSelectedCapper(null)} />
    </>
  );
}
