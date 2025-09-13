"use client";

import type { Pillar, Theme, Subtheme } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          {/* Pillar header */}
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {/* Themes */}
          {pillar.themes?.map((theme: Theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="text-md font-medium">
                {theme.ref_code} – {theme.name}
              </h3>
              {theme.description && (
                <p className="text-sm text-gray-600">{theme.description}</p>
              )}

              {/* Subthemes */}
              {theme.subthemes?.map((subtheme: Subtheme) => (
                <div key={subtheme.id} className="ml-6 mt-2">
                  <span className="block text-sm font-medium">
                    {subtheme.ref_code} – {subtheme.name}
                  </span>
                  {subtheme.description && (
                    <p className="text-xs text-gray-500">
                      {subtheme.description}
                    </p>
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
