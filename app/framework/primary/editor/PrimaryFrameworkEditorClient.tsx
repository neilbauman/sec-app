"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";

type Props = {
  initialPillars: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ initialPillars }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>(initialPillars);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Primary Framework Editor</h2>

      {pillars.length === 0 && (
        <p className="text-gray-500">No pillars found.</p>
      )}

      <ul className="space-y-2">
        {pillars.map((pillar) => (
          <li key={pillar.id} className="border rounded p-3">
            <h3 className="font-bold">{pillar.name}</h3>
            {pillar.description && (
              <p className="text-sm text-gray-600">{pillar.description}</p>
            )}

            {/* Themes */}
            {pillar.themes && pillar.themes.length > 0 && (
              <ul className="ml-4 mt-2 space-y-1">
                {pillar.themes.map((theme) => (
                  <li key={theme.id}>
                    <strong>{theme.name}</strong>
                    {theme.subthemes && theme.subthemes.length > 0 && (
                      <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
                        {theme.subthemes.map((sub) => (
                          <li key={sub.id}>{sub.name}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
