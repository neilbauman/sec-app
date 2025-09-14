// components/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";
import type { FrameworkData } from "@/types/framework";

interface Props {
  data: FrameworkData[];
}

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [pillars, setPillars] = useState<FrameworkData[]>(data);

  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <PrimaryFrameworkCards key={pillar.id} pillar={pillar} />
      ))}
    </div>
  );
}
