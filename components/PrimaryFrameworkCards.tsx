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
        <div
          key={pillar.id}
          className="border rounded-lg p-4 shadow-md bg-white"
        >
          <h2 className="text-xl font-bold mb-2">{pillar.name}</h2>
          <p className="text-gray-600 mb-4">{pillar.description}</p>

          {/* Themes */}
          <div className="ml-4 space-y-3">
            {pillar.themes?.map((theme: Theme) => (
              <div
                key={theme.id}
                className="border-l-2 pl-3 border-gray-300"
              >
                <h3 className="text-lg font-semibold">{theme.name}</h3>
                <p className="text-gray-500 mb-2">{theme.description}</p>

                {/* Subthemes */}
                <div className="ml-4 space-y-2">
                  {theme.subthemes?.map((sub: Subtheme) => (
                    <div
                      key={sub.id}
                      className="border-l pl-3 border-gray-200"
                    >
                      <h4 className="font-medium">{sub.name}</h4>
                      <p className="text-gray-500">{sub.description}</p>

                      {/* Indicators */}
                      <ul className="list-disc ml-5 text-gray-700">
                        {sub.indicators?.map((indicator: Indicator) => (
                          <li key={indicator.id}>{indicator.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Indicators directly under theme */}
                <ul className="list-disc ml-5 text-gray-700">
                  {theme.indicators?.map((indicator: Indicator) => (
                    <li key={indicator.id}>{indicator.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
