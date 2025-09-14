// components/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

interface Props {
  data: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>(data);

  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <PrimaryFrameworkCards key={pillar.id} pillars={[pillar]} />
      ))}
    </div>
  );
}
