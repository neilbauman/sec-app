// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx

"use client";

import { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: (Pillar & { themes?: (Theme & { subthemes?: Subtheme[] })[] })[];
};

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="text-gray-500">No pillars found.</p>
      ) : (
        <ul className="space-y-4">
          {pillars.map((pillar) => (
            <li key={pillar.id} className="border rounded p-4">
              <button
                className="w-full text-left font-semibold text-lg"
                onClick={() =>
                  setExpandedPillar(expandedPillar === pillar.id ? null : pillar.id)
                }
              >
                {pillar.name}
              </button>
              {expandedPillar === pillar.id && pillar.themes && (
                <ul className="ml-6 mt-2 space-y-2">
                  {pillar.themes.map((theme) => (
                    <li key={theme.id} className="border rounded p-2">
                      <button
                        className="w-full text-left font-medium"
                        onClick={() =>
                          setExpandedTheme(expandedTheme === theme.id ? null : theme.id)
                        }
                      >
                        {theme.name}
                      </button>
                      {expandedTheme === theme.id && theme.subthemes && (
                        <ul className="ml-6 mt-1 list-disc">
                          {theme.subthemes.map((subtheme) => (
                            <li key={subtheme.id}>{subtheme.name}</li>
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
      )}
    </div>
  );
}
