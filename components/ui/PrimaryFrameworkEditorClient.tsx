// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 border-b">
        <div className="col-span-3">Type / Ref Code</div>
        <div className="col-span-6">Name / Description</div>
        <div className="col-span-2 text-right">Sort Order</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {data.map((pillar) => (
        <div key={pillar.id}>
          {/* Pillar Row */}
          <div className="grid grid-cols-12 items-center px-4 py-2 border-b hover:bg-gray-50">
            <div className="col-span-3 flex items-center gap-2">
              <button onClick={() => toggleExpand(pillar.id)} className="text-gray-500">
                {expanded[pillar.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <Badge variant="default">Pillar</Badge>
            </div>
            <div className="col-span-6">
              <div className="font-medium">{pillar.name}</div>
              <div className="text-gray-500 text-sm">{pillar.description}</div>
            </div>
            <div className="col-span-2 text-right">{pillar.sort_order}</div>
            <div className="col-span-1 flex justify-end gap-2 text-gray-500">
              <Edit size={16} className="cursor-pointer hover:text-blue-600" />
              <Trash2 size={16} className="cursor-pointer hover:text-red-600" />
            </div>
          </div>

          {/* Themes */}
          {expanded[pillar.id] &&
            pillar.themes?.map((theme: Theme) => (
              <div
                key={theme.id}
                className="ml-6 grid grid-cols-12 items-center px-4 py-2 border-b hover:bg-gray-50"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <button onClick={() => toggleExpand(theme.id)} className="text-gray-500">
                    {expanded[theme.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <Badge variant="secondary">Theme</Badge>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-gray-500 text-sm">{theme.description}</div>
                </div>
                <div className="col-span-2 text-right">{theme.sort_order}</div>
                <div className="col-span-1 flex justify-end gap-2 text-gray-500">
                  <Edit size={16} className="cursor-pointer hover:text-blue-600" />
                  <Trash2 size={16} className="cursor-pointer hover:text-red-600" />
                </div>
              </div>
            ))}

          {/* Subthemes */}
          {pillar.themes?.map(
            (theme) =>
              expanded[theme.id] &&
              theme.subthemes?.map((sub: Subtheme) => (
                <div
                  key={sub.id}
                  className="ml-12 grid grid-cols-12 items-center px-4 py-2 border-b hover:bg-gray-50"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <Badge variant="success">Subtheme</Badge>
                  </div>
                  <div className="col-span-6">
                    <div className="font-medium">{sub.name}</div>
                    <div className="text-gray-500 text-sm">{sub.description}</div>
                  </div>
                  <div className="col-span-2 text-right">{sub.sort_order}</div>
                  <div className="col-span-1 flex justify-end gap-2 text-gray-500">
                    <Edit size={16} className="cursor-pointer hover:text-blue-600" />
                    <Trash2 size={16} className="cursor-pointer hover:text-red-600" />
                  </div>
                </div>
              ))
          )}
        </div>
      ))}
    </div>
  );
}
