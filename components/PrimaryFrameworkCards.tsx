// components/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar, Theme, Subtheme, Indicator } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="font-semibold">{theme.name}</h3>
              <p className="text-sm text-gray-500">{theme.description}</p>

              {theme.subthemes?.map((subtheme) => (
                <div key={subtheme.id} className="ml-4 mt-2">
                  <h4 className="italic">{subtheme.name}</h4>
                  <p className="text-xs text-gray-500">{subtheme.description}</p>

                  <ul className="ml-4 list-disc text-xs">
                    {subtheme.indicators?.map((indicator) => (
                      <li key={indicator.id}>{indicator.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
