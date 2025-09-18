"use client";

import React, { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  // Track collapsed/expanded IDs
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Column Headings */}
      <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2">
        <span>Name</span>
        <span>Description</span>
        <span>Sort Order</span>
        <span>Type</span>
      </div>

      {/* Framework Tree */}
      {framework.map((pillar) => (
        <div key={pillar.id} className="border rounded-lg p-4 bg-white shadow-sm">
          {/* Pillar Row */}
          <div
            className="grid grid-cols-4 gap-4 items-center cursor-pointer"
            onClick={() => toggleExpand(pillar.id)}
          >
            <span className="font-bold text-blue-700">{pillar.name}</span>
            <span>{pillar.description}</span>
            <span>{pillar.sort_order}</span>
            <span className="text-blue-500">Pillar</span>
          </div>

          {/* Themes (collapsible) */}
          {expanded[pillar.id] && (
            <div className="ml-6 mt-2 space-y-2">
              {pillar.themes?.map((theme: Theme) => (
                <div
                  key={theme.id}
                  className="border-l-2 border-blue-200 pl-4 py-1"
                >
                  <div
                    className="grid grid-cols-4 gap-4 cursor-pointer"
                    onClick={() => toggleExpand(theme.id)}
                  >
                    <span className="font-semibold text-green-700">
                      {theme.name}
                    </span>
                    <span>{theme.description}</span>
                    <span>{theme.sort_order}</span>
                    <span className="text-green-500">Theme</span>
                  </div>

                  {/* Subthemes */}
                  {expanded[theme.id] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {theme.subthemes?.map((sub: Subtheme) => (
                        <div
                          key={sub.id}
                          className="grid grid-cols-4 gap-4 text-sm"
                        >
                          <span className="text-purple-700">{sub.name}</span>
                          <span>{sub.description}</span>
                          <span>{sub.sort_order}</span>
                          <span className="text-purple-500">Subtheme</span>
                        </div>
                      ))}
                    </div>
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
