"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  if (!framework || framework.length === 0) {
    return <p>No framework data found in the database.</p>;
  }

  return (
    <div className="space-y-4">
      {framework.map((pillar) => (
        <div key={pillar.id} className="border p-4 rounded">
          <h2 className="font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="ml-4">
              <h3 className="font-medium">{theme.name}</h3>
              <p className="text-gray-500">{theme.description}</p>

              {theme.subthemes?.map((sub) => (
                <div key={sub.id} className="ml-6">
                  <h4 className="text-sm">{sub.name}</h4>
                  <p className="text-gray-400">{sub.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
