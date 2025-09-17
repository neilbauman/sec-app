"use client";

import { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { PlusCircle, ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded flex items-center space-x-1">
          <PlusCircle className="w-4 h-4" />
          <span>New Pillar</span>
        </button>
        <button className="px-3 py-2 bg-gray-200 rounded flex items-center space-x-1">
          <PlusCircle className="w-4 h-4" />
          <span>New Theme</span>
        </button>
        <button className="px-3 py-2 bg-gray-200 rounded flex items-center space-x-1">
          <PlusCircle className="w-4 h-4" />
          <span>New Sub-theme</span>
        </button>
      </div>

      {framework.length === 0 ? (
        <p className="text-gray-500">No framework found. Add your first pillar to get started.</p>
      ) : (
        <div className="space-y-4">
          {framework.map((pillar) => (
            <div key={pillar.id} className="border rounded p-4">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => toggleExpand(pillar.id)}
              >
                {expanded[pillar.id] ? (
                  <ChevronDown className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                <h2 className="font-semibold">{pillar.name}</h2>
              </div>
              <p className="text-sm text-gray-600 ml-6">{pillar.description}</p>

              {expanded[pillar.id] && pillar.themes?.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {pillar.themes.map((theme: Theme) => (
                    <div key={theme.id} className="border-l-2 pl-3">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleExpand(theme.id)}
                      >
                        {expanded[theme.id] ? (
                          <ChevronDown className="w-4 h-4 mr-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-2" />
                        )}
                        <h3 className="font-medium">{theme.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{theme.description}</p>

                      {expanded[theme.id] && theme.subthemes?.length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                          {theme.subthemes.map((sub: Subtheme) => (
                            <div key={sub.id} className="border-l-2 pl-3">
                              <h4 className="font-normal">{sub.name}</h4>
                              <p className="text-sm text-gray-600">{sub.description}</p>
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
      )}
    </div>
  );
}
