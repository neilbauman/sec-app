// components/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid gap-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded-xl p-4 shadow-sm bg-white">
          {/* Pillar Header */}
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-700">Pillar</span>
            <span className="ml-2 text-xs text-gray-500">{pillar.ref_code}</span>
          </div>
          <h2 className="text-lg font-bold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {/* Themes */}
          {pillar.themes?.length > 0 && (
            <div className="ml-4 mt-4 space-y-4">
              {pillar.themes.map((theme) => (
                <div key={theme.id} className="border-l-2 pl-4">
                  <div className="mb-1">
                    <span className="text-sm font-semibold text-gray-700">Theme</span>
                    <span className="ml-2 text-xs text-gray-500">{theme.ref_code}</span>
                  </div>
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-gray-600">{theme.description}</p>

                  {/* Subthemes */}
                  {theme.subthemes?.length > 0 && (
                    <div className="ml-4 mt-3 space-y-3">
                      {theme.subthemes.map((subtheme) => (
                        <div key={subtheme.id} className="border-l-2 pl-4">
                          <div className="mb-1">
                            <span className="text-sm font-semibold text-gray-700">Subtheme</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {subtheme.ref_code}
                            </span>
                          </div>
                          <h4 className="font-medium">{subtheme.name}</h4>
                          <p className="text-gray-600">{subtheme.description}</p>

                          {/* Indicators */}
                          {subtheme.indicators?.length > 0 && (
                            <ul className="ml-4 mt-2 list-disc text-gray-700 text-sm">
                              {subtheme.indicators.map((indicator) => (
                                <li key={indicator.id}>
                                  <span className="font-semibold">{indicator.ref_code}</span> -{" "}
                                  {indicator.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
