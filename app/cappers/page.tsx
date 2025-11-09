"use client";

import { useState } from "react";
import { BrowseCappers, CapperModal } from "@/components/mock-ui";
import type { Capper } from "@/lib/mock-data";

export default function CappersPage() {
  const [selectedCapper, setSelectedCapper] = useState<Capper | null>(null);

  return (
    <>
      <BrowseCappers
        onOpen={(capper) => {
          setSelectedCapper(capper);
        }}
      />
      <CapperModal open={Boolean(selectedCapper)} capper={selectedCapper} onClose={() => setSelectedCapper(null)} />
    </>
  );
}
