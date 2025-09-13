"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-xl border p-4 shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          <div className="mt-4 space-y-2">
            {pillar.themes.map((theme) => (
              <div key={theme.id} className="pl-2 border-l">
                <h3 className="font-medium">
                  {theme.ref_code} – {theme.name}
                </h3>
                {theme.description && (
                  <p className="text-sm text-gray-500">{theme.description}</p>
                )}

                <div className="mt-2 pl-2 space-y-1">
                  {theme.subthemes.map((subtheme) => (
                    <div key={subtheme.id} className="text-sm">
                      <span className="font-medium">Subtheme</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {subtheme.ref_code}
                      </span>
                      <div>
                        {subtheme.name}
                        {subtheme.description && (
                          <p className="text-xs text-gray-400">
                            {subtheme.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
