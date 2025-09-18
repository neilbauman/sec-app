// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import React, { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import Badge from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Column Headings */}
      <div className="grid grid-cols-12 font-semibold text-sm text-gray-600 border-b pb-2">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Name</div>
        <div className="col-span-6">Description</div>
        <div className="col-span-2 text-right">Tags</div>
      </div>

      {framework.map((pillar, pillarIndex) => (
        <div key={pillar.id} className="border rounded-lg shadow-sm">
          {/* Pillar row */}
          <div
            className="flex items-center p-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleExpand(pillar.id)}
          >
            <div className="w-6">
              {expanded[pillar.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            <div className="grid grid-cols-12 w-full items-center">
              <div className="col-span-1">{pillar.sort_order}</div>
              <div className="col-span-3 font-bold text-blue-800">
                {pillar.name}
              </div>
              <div className="col-span-6 text-gray-700">
                {pillar.description}
              </div>
              <div className="col-span-2 text-right">
                <Badge className="bg-blue-100 text-blue-800">Pillar</Badge>
              </div>
            </div>
          </div>

          {/* Themes under this Pillar */}
          {expanded[pillar.id] &&
            pillar.themes?.map((theme: Theme, themeIndex: number) => (
              <div
                key={theme.id}
                className="ml-8 border-t border-gray-200"
              >
                <div
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(theme.id)}
                >
                  <div className="w-6">
                    {expanded[theme.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="grid grid-cols-12 w-full items-center">
                    <div className="col-span-1">
                      {pillar.sort_order}.{theme.sort_order}
                    </div>
                    <div className="col-span-3 font-medium text-green-700">
                      {theme.name}
                    </div>
                    <div className="col-span-6 text-gray-700">
                      {theme.description}
                    </div>
                    <div className="col-span-2 text-right">
                      <Badge className="bg-green-100 text-green-800">
                        Theme
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Subthemes under this Theme */}
                {expanded[theme.id] &&
                  theme.subthemes?.map(
                    (subtheme: Subtheme, subthemeIndex: number) => (
                      <div
                        key={subtheme.id}
                        className="ml-8 border-t border-gray-100 p-3 grid grid-cols-12 items-center"
                      >
                        <div className="col-span-1">
                          {pillar.sort_order}.{theme.sort_order}.
                          {subtheme.sort_order}
                        </div>
                        <div className="col-span-3 text-purple-700">
                          {subtheme.name}
                        </div>
                        <div className="col-span-6 text-gray-700">
                          {subtheme.description}
                        </div>
                        <div className="col-span-2 text-right">
                          <Badge className="bg-purple-100 text-purple-800">
                            Subtheme
                          </Badge>
                        </div>
                      </div>
                    )
                  )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
