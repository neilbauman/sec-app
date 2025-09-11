"use client";

import React from "react";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default function Page() {
  // Assuming you fetch or define these somewhere above
  const pillars: Pillar[] = [];
  const themes: Theme[] = [];
  const subthemes: Subtheme[] = [];

  return (
    <main className="p-4">
      <div>
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={pillars as Pillar[]}
          themes={themes as Theme[]}
          subthemes={subthemes as Subtheme[]}
          actions={<></>} // keep the right-side actions column aligned; no-op for now
        />
      </div>
    </main>
  );
}
