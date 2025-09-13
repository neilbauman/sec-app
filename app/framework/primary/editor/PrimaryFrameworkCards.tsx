// app/framework/primary/editor/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar } from "@/types";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  if (!pillars?.length) {
    return <p className="text-gray-500">No pillars available</p>;
  }

  return (
    <div className="space-y-4">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-lg border bg-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
