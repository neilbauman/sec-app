// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import React from "react";
import type { Pillar } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  return (
    <div className="space-y-6">
      {framework.map((pillar) => (
        <div key={pillar.id} className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {pillar.themes?.length > 0 && (
            <div className="mt-4 space-y-3">
              {pillar.themes.map((theme) => (
                <div key={theme.id} className="ml-4 border-l pl-4">
                  <h3 className="text-lg font-medium">{theme.name}</h3>
                  <p className="text-gray-500">{theme.description}</p>

                  {theme.subthemes?.length > 0 && (
                    <ul className="mt-2 ml-4 list-disc text-sm text-gray-500">
                      {theme.subthemes.map((subtheme) => (
                        <li key={subtheme.id}>
                          <span className="font-medium">{subtheme.name}:</span>{" "}
                          {subtheme.description}
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
