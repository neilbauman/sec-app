"use client";

import { useState, useEffect } from "react";
import PrimaryFrameworkCards from "@/app/framework/primary/editor/PrimaryFrameworkCards";
import type { Pillar } from "@/types/framework";

interface Props {
  data: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>(data || []);

  useEffect(() => {
    setPillars(data || []);
  }, [data]);

  if (!pillars || pillars.length === 0) {
    return <p className="text-gray-500">No pillars available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* ✅ Pass pillars array instead of individual pillar */}
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
