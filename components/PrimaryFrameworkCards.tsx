// components/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar, Theme } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="border rounded-2xl p-4 shadow bg-white"
        >
          <h2 className="text-lg font-semibold">{pillar.name}</h2>
          <p className="text-gray-600 text-sm">{pillar.description}</p>

          {pillar.themes && pillar.themes.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
              {pillar.themes.map((theme: Theme) => (
                <li key={theme.id}>{theme.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
