"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-lg border p-4 shadow hover:shadow-md transition"
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
