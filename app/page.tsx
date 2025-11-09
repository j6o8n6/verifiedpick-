"use client";

import { useState } from "react";
import { Hero, FeaturedCappers, TopROIWidget, HowItWorks, CapperModal } from "@/components/mock-ui";
import type { Capper } from "@/lib/mock-data";

export default function HomePage() {
  const [selectedCapper, setSelectedCapper] = useState<Capper | null>(null);

  return (
    <>
      <Hero />
      <FeaturedCappers
        onOpen={(capper) => {
          setSelectedCapper(capper);
        }}
      />
      <TopROIWidget
        onOpen={(capper) => {
          setSelectedCapper(capper);
        }}
      />
      <HowItWorks />
      <CapperModal open={Boolean(selectedCapper)} capper={selectedCapper} onClose={() => setSelectedCapper(null)} />
    </>
  );
}
