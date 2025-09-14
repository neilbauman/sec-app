// app/framework/primary/editor/PrimaryFrameworkCards.tsx

"use client";

import { Pillar, Theme, Subtheme, Indicator } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow"
        >
          <h2 className="text-xl font-bold text-gray-900">
            {pillar.ref_code} — {pillar.name}
          </h2>
          {pillar.description && (
            <p className="mt-2 text-gray-600">{pillar.description}</p>
          )}

          {/* THEMES */}
          <div className="mt-4 space-y-4">
            {pillar.themes?.map((theme: Theme) => (
              <div
                key={theme.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {theme.ref_code} — {theme.name}
                </h3>
                {theme.description && (
                  <p className="mt-1 text-gray-600">{theme.description}</p>
                )}

                {/* SUBTHEMES */}
                <div className="mt-3 ml-4 space-y-3">
                  {theme.subthemes?.map((sub: Subtheme) => (
                    <div
                      key={sub.id}
                      className="rounded-md border border-gray-200 bg-white p-3"
                    >
                      <h4 className="text-md font-medium text-gray-700">
                        {sub.ref_code} — {sub.name}
                      </h4>
                      {sub.description && (
                        <p className="text-sm text-gray-500">{sub.description}</p>
                      )}

                      {/* INDICATORS under Subtheme */}
                      <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
                        {sub.indicators?.map((ind: Indicator) => (
                          <li key={ind.id}>
                            <span className="font-medium">{ind.ref_code}</span>{" "}
                            — {ind.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* INDICATORS directly under Theme */}
                {theme.indicators && theme.indicators.length > 0 && (
                  <div className="mt-3 ml-4">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Indicators
                    </h4>
                    <ul className="ml-4 list-disc text-sm text-gray-600">
                      {theme.indicators.map((ind: Indicator) => (
                        <li key={ind.id}>
                          <span className="font-medium">{ind.ref_code}</span>{" "}
                          — {ind.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
