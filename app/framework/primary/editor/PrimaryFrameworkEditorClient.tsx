// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [frameworkData] = useState<Pillar[]>(pillars);

  return (
    <div className="grid grid-cols-1 gap-6">
      {frameworkData.map((pillar) => (
        <PrimaryFrameworkCards key={pillar.id} pillar={pillar} />
      ))}
    </div>
  );
}
