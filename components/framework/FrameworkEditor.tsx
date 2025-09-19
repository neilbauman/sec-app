// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";

interface Subtheme {
  id: string;
  name: string;
}
interface Theme {
  id: string;
  name: string;
  subthemes?: Subtheme[];
}
interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}

const initialFramework: Pillar[] = [
  {
    id: "1",
    name: "Shelter",
    themes: [
      {
        id: "1-1",
        name: "Materials & Construction",
        subthemes: [
          { id: "1-1-1", name: "Durability" },
          { id: "1-1-2", name: "Safety" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Settlement",
    themes: [
      {
        id: "2-1",
        name: "Site Planning",
        subthemes: [{ id: "2-1-1", name: "Community Spaces" }],
      },
    ],
  },
];

export default function FrameworkEditor() {
  const [framework, setFramework] = useState<Pillar[]>(initialFramework);

  return (
    <div className="space-y-6">
      {framework.map((pillar, idx) => (
        <div
          key={pillar.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold text-green-700">
            Pillar {idx + 1}: {pillar.name}
          </h2>
          <ul className="ml-4 mt-2 space-y-2">
            {pillar.themes.map((theme) => (
              <li key={theme.id}>
                <p className="font-medium">{theme.name}</p>
                {theme.subthemes && (
                  <ul className="ml-6 list-disc">
                    {theme.subthemes.map((sub) => (
                      <li key={sub.id}>{sub.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
