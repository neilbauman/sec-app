// components/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="p-4 border rounded-xl shadow-sm bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          <div className="mt-4">
            {pillar.themes?.map((theme) => (
              <div key={theme.id} className="ml-4 mb-2">
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-gray-500">{theme.description}</p>

                {theme.subthemes?.map((sub) => (
                  <div key={sub.id} className="ml-6 mt-1">
                    <h4 className="text-sm font-semibold">{sub.name}</h4>
                    <p className="text-gray-500">{sub.description}</p>

                    {sub.indicators?.map((ind) => (
                      <div
                        key={ind.id}
                        className="ml-6 text-xs text-gray-400 mt-1"
                      >
                        • {ind.name} ({ind.ref_code})
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
