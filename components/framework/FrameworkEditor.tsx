// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

// Mock framework data (replace with real SSC definitions later)
const initialPillars = [
  {
    id: "pillar-1",
    name: "Pillar 1: Shelter",
    themes: [
      { id: "theme-1", name: "Materials & Construction" },
      { id: "theme-2", name: "Durability & Safety" },
    ],
  },
  {
    id: "pillar-2",
    name: "Pillar 2: Settlement",
    themes: [
      { id: "theme-3", name: "Site Planning" },
      { id: "theme-4", name: "Community Spaces" },
    ],
  },
];

export default function FrameworkEditor() {
  const [pillars] = useState(initialPillars);

  return (
    <div className="space-y-6">
      {/* ✅ Header always first */}
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      {/* ✅ Main content */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-brand-green mb-2">
              {pillar.name}
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {pillar.themes.map((theme) => (
                <li key={theme.id}>{theme.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
