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
    <div>
      <h2 className="text-xl font-bold mb-4">Editor View</h2>
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
