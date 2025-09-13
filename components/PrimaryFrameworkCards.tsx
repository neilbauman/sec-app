"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="mt-4 pl-4 border-l">
              <h3 className="font-medium">
                {theme.ref_code} – {theme.name}
              </h3>
              {theme.description && (
                <p className="text-sm text-gray-600">{theme.description}</p>
              )}

              {theme.subthemes?.map((subtheme) => (
                <div key={subtheme.id} className="mt-2 pl-4 border-l">
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
