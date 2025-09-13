"use client";

import type { Pillar, Theme, Subtheme, Indicator } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  if (!pillars || pillars.length === 0) {
    return <p className="text-gray-600">No framework data found.</p>;
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar: Pillar) => (
        <div key={pillar.id} className="rounded-lg border p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes?.map((theme: Theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="font-medium">
                {theme.ref_code} – {theme.name}
              </h3>
              {theme.description && (
                <p className="text-sm text-gray-600">{theme.description}</p>
              )}

              {theme.subthemes?.map((subtheme: Subtheme) => (
                <div key={subtheme.id} className="ml-4 mt-3">
                  <h4 className="text-sm font-semibold">
                    {subtheme.ref_code} – {subtheme.name}
                  </h4>
                  {subtheme.description && (
                    <p className="text-xs text-gray-600">{subtheme.description}</p>
                  )}

                  {subtheme.indicators?.length > 0 && (
                    <ul className="ml-4 mt-2 list-disc text-gray-700 text-sm">
                      {subtheme.indicators.map((indicator: Indicator) => (
                        <li key={indicator.id}>
                          {indicator.ref_code} – {indicator.name}
                          {indicator.description && (
                            <p className="text-xs text-gray-500">
                              {indicator.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
