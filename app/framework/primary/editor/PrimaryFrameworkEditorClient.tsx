"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

interface Props {
  initialPillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ initialPillars }: Props) {
  const [pillars] = useState<Pillar[]>(initialPillars);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Framework Editor</h1>
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
