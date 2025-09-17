// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useEffect, useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import type { Pillar } from "@/types/framework";
import { getFramework } from "@/lib/framework";

export default function PrimaryFrameworkEditorClient() {
  const [framework, setFramework] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFramework() {
      try {
        const data = await getFramework();
        setFramework(data);
      } catch (err) {
        console.error("Failed to load framework", err);
      } finally {
        setLoading(false);
      }
    }
    loadFramework();
  }, []);

  return (
    <div>
      <ToolHeader
        title="Primary Framework Editor"
        description="Manage pillars, themes, and sub-themes with their descriptions."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />

      {loading ? (
        <p className="text-gray-500">Loading framework...</p>
      ) : (
        <div className="space-y-4">
          {framework.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-medium text-gray-900">{pillar.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{pillar.description}</p>

              {/* Themes */}
              {pillar.themes?.length > 0 && (
                <ul className="ml-4 list-disc text-gray-700">
                  {pillar.themes.map((theme) => (
                    <li key={theme.id}>
                      <span className="font-medium">{theme.name}</span>:{" "}
                      {theme.description}
                      {/* Subthemes */}
                      {theme.subthemes?.length > 0 && (
                        <ul className="ml-6 list-[circle] text-gray-600">
                          {theme.subthemes.map((sub) => (
                            <li key={sub.id}>
                              <span className="font-medium">{sub.name}</span>:{" "}
                              {sub.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
