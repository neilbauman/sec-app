// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import React, { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import Badge from "@/components/ui/Badge";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({});
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) => {
    setExpandedPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTheme = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <div className="border rounded-lg shadow bg-white">
        {/* Table header */}
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm px-4 py-2 border-b">
          <div className="col-span-3">Name</div>
          <div className="col-span-6">Description</div>
          <div className="col-span-1 text-center">Order</div>
          <div className="col-span-2 text-center">Type</div>
        </div>

        {/* Content */}
        <div className="divide-y">
          {framework.map((pillar) => (
            <div key={pillar.id}>
              {/* Pillar row */}
              <div
                className="grid grid-cols-12 items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => togglePillar(pillar.id)}
              >
                <div className="col-span-3 font-bold">
                  {expandedPillars[pillar.id] ? "▼ " : "▶ "} {pillar.name}
                </div>
                <div className="col-span-6">{pillar.description}</div>
                <div className="col-span-1 text-center">{pillar.sort_order}</div>
                <div className="col-span-2 text-center">
                  <Badge color="blue">Pillar</Badge>
                </div>
              </div>

              {/* Themes */}
              {expandedPillars[pillar.id] &&
                pillar.themes?.map((theme: Theme) => (
                  <div key={theme.id}>
                    <div
                      className="grid grid-cols-12 items-center pl-8 pr-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleTheme(theme.id)}
                    >
                      <div className="col-span-3">
                        {expandedThemes[theme.id] ? "▼ " : "▶ "} {theme.name}
                      </div>
                      <div className="col-span-6">{theme.description}</div>
                      <div className="col-span-1 text-center">{theme.sort_order}</div>
                      <div className="col-span-2 text-center">
                        <Badge color="green">Theme</Badge>
                      </div>
                    </div>

                    {/* Subthemes */}
                    {expandedThemes[theme.id] &&
                      theme.subthemes?.map((sub: Subtheme) => (
                        <div
                          key={sub.id}
                          className="grid grid-cols-12 items-center pl-16 pr-4 py-2 hover:bg-gray-50"
                        >
                          <div className="col-span-3">{sub.name}</div>
                          <div className="col-span-6">{sub.description}</div>
                          <div className="col-span-1 text-center">{sub.sort_order}</div>
                          <div className="col-span-2 text-center">
                            <Badge color="red">Subtheme</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
