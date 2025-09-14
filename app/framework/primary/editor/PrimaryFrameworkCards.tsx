"use client";

import { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  if (!pillars || pillars.length === 0) {
    return <p className="text-gray-500">No framework data available.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow"
        >
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="mt-1 text-sm text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes && pillar.themes.length > 0 && (
            <div className="mt-3 space-y-3">
              {pillar.themes.map((theme) => (
                <div
                  key={theme.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <h3 className="text-md font-medium">
                    {theme.ref_code} – {theme.name}
                  </h3>
                  {theme.description && (
                    <p className="text-xs text-gray-600">{theme.description}</p>
                  )}

                  {theme.subthemes && theme.subthemes.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {theme.subthemes.map((subtheme) => (
                        <div
                          key={subtheme.id}
                          className="rounded-md border border-gray-200 bg-white p-2"
                        >
                          <h4 className="text-sm font-medium">
                            {subtheme.ref_code} – {subtheme.name}
                          </h4>
                          {subtheme.description && (
                            <p className="text-xs text-gray-500">
                              {subtheme.description}
                            </p>
                          )}

                          {subtheme.indicators &&
                            subtheme.indicators.length > 0 && (
                              <ul className="mt-1 list-disc pl-5 text-xs text-gray-600">
                                {subtheme.indicators.map((indicator) => (
                                  <li key={indicator.id}>
                                    {indicator.ref_code} – {indicator.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                  {theme.indicators && theme.indicators.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-xs text-gray-600">
                      {theme.indicators.map((indicator) => (
                        <li key={indicator.id}>
                          {indicator.ref_code} – {indicator.name}
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
  );
}
