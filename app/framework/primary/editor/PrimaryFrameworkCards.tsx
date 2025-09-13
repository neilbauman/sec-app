// components/PrimaryFrameworkCards.tsx
"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded-lg p-4 shadow-sm">
          {/* Pillar Header */}
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {/* Themes */}
          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="mt-3 ml-4">
              <h3 className="text-md font-medium">
                {theme.ref_code} – {theme.name}
              </h3>
              {theme.description && (
                <p className="text-sm text-gray-500">{theme.description}</p>
              )}

              {/* Subthemes */}
              {theme.subthemes?.map((subtheme) => (
                <div key={subtheme.id} className="ml-4 mt-2">
                  <span className="block text-sm font-medium">Subtheme</span>
                  <span className="text-xs text-gray-500">
                    {subtheme.ref_code}
                  </span>

                  <div>
                    <p className="text-sm font-medium">{subtheme.name}</p>
                    {subtheme.description && (
                      <p className="text-xs text-gray-500">
                        {subtheme.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
