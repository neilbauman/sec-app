"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit, Trash } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader"; // ✅ fixed import
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { getFramework } from "@/lib/framework";

interface NodeState {
  [id: string]: boolean;
}

export default function PrimaryFrameworkEditorClient() {
  const [framework, setFramework] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<NodeState>({});

  useEffect(() => {
    async function fetchData() {
      const data = await getFramework();
      setFramework(data);
    }
    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[{ label: "Configuration", href: "/configuration" }, { label: "Primary Framework Editor" }]}
        group="Configuration"
      />

      <div className="mt-6 space-y-4">
        {framework.map((pillar) => (
          <div key={pillar.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleExpand(pillar.id)}
                className="flex items-center font-semibold text-lg"
              >
                {expanded[pillar.id] ? (
                  <ChevronDown className="w-5 h-5 mr-2" />
                ) : (
                  <ChevronRight className="w-5 h-5 mr-2" />
                )}
                {pillar.name}
              </button>
              <div className="space-x-2">
                <button className="p-1 text-gray-600 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-600 hover:text-red-600">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 ml-7">{pillar.description}</p>

            {expanded[pillar.id] && (
              <div className="ml-7 mt-3 space-y-2">
                {pillar.themes.map((theme: Theme) => (
                  <div key={theme.id} className="border-l pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{theme.name}</span>
                      <div className="space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-red-600">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{theme.description}</p>

                    {theme.subthemes.map((subtheme: Subtheme) => (
                      <div key={subtheme.id} className="ml-4 border-l pl-4 mt-2">
                        <div className="flex items-center justify-between">
                          <span>{subtheme.name}</span>
                          <div className="space-x-2">
                            <button className="p-1 text-gray-600 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-red-600">
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{subtheme.description}</p>
                      </div>
                    ))}

                    <button className="mt-2 flex items-center text-sm text-blue-600 hover:underline">
                      <Plus className="w-4 h-4 mr-1" /> Add Subtheme
                    </button>
                  </div>
                ))}

                <button className="mt-2 flex items-center text-sm text-blue-600 hover:underline">
                  <Plus className="w-4 h-4 mr-1" /> Add Theme
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="flex items-center text-sm text-green-600 hover:underline">
          <Plus className="w-4 h-4 mr-1" /> Add Pillar
        </button>
      </div>
    </div>
  );
}
