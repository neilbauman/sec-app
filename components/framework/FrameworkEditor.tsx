// components/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import { NestedPillar } from "@/lib/framework-client";
import {
  editPillar,
  editTheme,
  editSubtheme,
} from "@/lib/framework-actions";
import { Button } from "@/components/ui/button";

type Props = {
  data: NestedPillar[]; // 👈 match existing usage in page.tsx
};

export default function FrameworkEditor({ data }: Props) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleChange(
    type: "pillar" | "theme" | "subtheme",
    id: string,
    field: "name" | "description",
    value: string
  ) {
    setLoadingId(id);
    try {
      let updated: NestedPillar[] = pillars;
      if (type === "pillar") {
        updated = await editPillar(pillars, id, { [field]: value });
      } else if (type === "theme") {
        updated = await editTheme(pillars, id, { [field]: value });
      } else if (type === "subtheme") {
        updated = await editSubtheme(pillars, id, { [field]: value });
      }
      setPillars(updated);
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Error saving changes.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <input
                className="w-full font-semibold text-lg mb-1"
                value={pillar.name}
                disabled={loadingId === pillar.id}
                onChange={(e) =>
                  handleChange("pillar", pillar.id, "name", e.target.value)
                }
              />
              <textarea
                className="w-full text-sm text-gray-600"
                value={pillar.description}
                disabled={loadingId === pillar.id}
                onChange={(e) =>
                  handleChange("pillar", pillar.id, "description", e.target.value)
                }
              />
            </div>
            <div className="ml-2">
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {pillar.ref_code}
              </span>
            </div>
          </div>

          {/* Themes */}
          <div className="mt-3 ml-4 space-y-4">
            {pillar.themes.map((theme) => (
              <div key={theme.id} className="border-l pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <input
                      className="w-full font-medium mb-1"
                      value={theme.name}
                      disabled={loadingId === theme.id}
                      onChange={(e) =>
                        handleChange("theme", theme.id, "name", e.target.value)
                      }
                    />
                    <textarea
                      className="w-full text-sm text-gray-600"
                      value={theme.description}
                      disabled={loadingId === theme.id}
                      onChange={(e) =>
                        handleChange(
                          "theme",
                          theme.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="ml-2">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                      {theme.ref_code}
                    </span>
                  </div>
                </div>

                {/* Subthemes */}
                <div className="mt-2 ml-4 space-y-2">
                  {theme.subthemes.map((sub) => (
                    <div key={sub.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <input
                          className="w-full text-sm mb-1"
                          value={sub.name}
                          disabled={loadingId === sub.id}
                          onChange={(e) =>
                            handleChange(
                              "subtheme",
                              sub.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <textarea
                          className="w-full text-xs text-gray-600"
                          value={sub.description}
                          disabled={loadingId === sub.id}
                          onChange={(e) =>
                            handleChange(
                              "subtheme",
                              sub.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="ml-2">
                        <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                          {sub.ref_code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
