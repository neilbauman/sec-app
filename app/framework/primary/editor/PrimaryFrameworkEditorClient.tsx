// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx
"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
        No framework data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded p-4 bg-white shadow">
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="font-semibold">
                {theme.ref_code} – {theme.name}
              </h3>
              {theme.description && (
                <p className="text-sm text-gray-600">{theme.description}</p>
              )}

              {theme.subthemes?.map((subtheme) => (
                <div key={subtheme.id} className="ml-4 mt-2">
                  <h4 className="font-medium">
                    {subtheme.ref_code} – {subtheme.name}
                  </h4>
                  {subtheme.description && (
                    <p className="text-sm text-gray-600">
                      {subtheme.description}
                    </p>
                  )}

                  {subtheme.indicators?.map((indicator) => (
                    <div key={indicator.id} className="ml-4 mt-1">
                      <p className="text-sm">
                        {indicator.ref_code} – {indicator.name}
                      </p>
                      {indicator.description && (
                        <p className="text-xs text-gray-500">
                          {indicator.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
