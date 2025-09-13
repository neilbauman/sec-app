// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import type { Pillar } from "@/types/framework";

interface Props {
  initialData: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ initialData }: Props) {
  const [pillars] = useState(initialData);

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-lg border border-gray-200 bg-white shadow-sm p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {pillar.ref_code}: {pillar.name}
              </h2>
              <p className="text-gray-600 mt-1">{pillar.description}</p>
            </div>
            <span className="text-sm text-gray-400">
              Order: {pillar.sort_order}
            </span>
          </div>

          {/* Placeholder for themes */}
          <div className="mt-4">
            <p className="text-gray-500 italic">Themes will display here…</p>
          </div>
        </div>
      ))}
    </div>
  );
}
