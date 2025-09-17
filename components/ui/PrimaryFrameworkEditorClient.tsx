// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import type { Pillar } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>
      <ul className="space-y-2">
        {framework.map((pillar) => (
          <li key={pillar.id} className="border p-2 rounded">
            <h2 className="font-semibold">{pillar.name}</h2>
            <p className="text-gray-600">{pillar.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
