// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useEffect, useState } from "react";
import { getFramework } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import ToolHeader from "@/components/ui/ToolHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrimaryFrameworkEditorClient() {
  const [framework, setFramework] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getFramework();
      setFramework(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading framework...</p>;
  }

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        group="Configuration"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="flex space-x-2">
        <Button>+ New Pillar</Button>
        <Button variant="outline">+ New Theme</Button>
        <Button variant="outline">+ New Sub-theme</Button>
      </div>

      {framework.length === 0 ? (
        <p className="text-gray-500">
          No framework found. Add your first pillar to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {framework.map((pillar) => (
            <Card key={pillar.id} className="p-4">
              <h2 className="text-lg font-semibold">{pillar.name}</h2>
              <p className="text-gray-600">{pillar.description}</p>

              {pillar.themes?.length ? (
                <ul className="ml-6 mt-2 list-disc">
                  {pillar.themes.map((theme: Theme) => (
                    <li key={theme.id}>
                      <strong>{theme.name}</strong> — {theme.description}
                      {theme.subthemes?.length ? (
                        <ul className="ml-6 mt-1 list-disc text-sm text-gray-700">
                          {theme.subthemes.map((sub: Subtheme) => (
                            <li key={sub.id}>
                              <span className="font-medium">{sub.name}</span> —{" "}
                              {sub.description}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-4 text-sm text-gray-500">
                  No themes under this pillar.
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
