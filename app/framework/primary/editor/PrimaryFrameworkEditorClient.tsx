"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

interface Props {
  initialPillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ initialPillars }: Props) {
  const [pillars] = useState<Pillar[]>(initialPillars);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Framework Editor</h1>
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
