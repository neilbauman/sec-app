"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [data] = useState(pillars ?? []);

  return (
    <div className="space-y-6">
      <PrimaryFrameworkCards pillars={data} />
    </div>
  );
}
