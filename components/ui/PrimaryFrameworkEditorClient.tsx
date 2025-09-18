// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Pillar } from "@/types/framework";
import { ToolHeader } from "@/components/ui/ToolHeader";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[{ label: "Configuration", href: "/configuration" }]}
        actions={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />

      {/* Table headings */}
      <div className="grid grid-cols-12 font-semibold border-b pb-2">
        <div className="col-span-2">Type / Ref Code</div>
        <div className="col-span-6">Name / Description</div>
        <div className="col-span-2 text-right">Sort Order</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Pillars */}
      {framework.map((pillar) => (
        <div key={pillar.id}>
          <div className="grid grid-cols-12 items-center border-b py-2">
            <div
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => toggle(pillar.id)}
            >
              {expanded[pillar.id] ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">
                P{pillar.sort_order} {pillar.name}
              </span>
            </div>
            <div className="col-span-6">{pillar.description}</div>
            <div className="col-span-2 text-right">{pillar.sort_order}</div>
            <div className="col-span-2 flex justify-end space-x-2">
              <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
              <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
            </div>
          </div>

          {/* Themes */}
          {expanded[pillar.id] &&
            pillar.themes?.map((theme) => (
              <div key={theme.id}>
                <div className="ml-6 grid grid-cols-12 items-center border-b py-2">
                  <div
                    className="col-span-2 flex items-center cursor-pointer"
                    onClick={() => toggle(theme.id)}
                  >
                    {expanded[theme.id] ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <span>
                      P{pillar.sort_order}.T{theme.sort_order} {theme.name}
                    </span>
                  </div>
                  <div className="col-span-6">{theme.description}</div>
                  <div className="col-span-2 text-right">{theme.sort_order}</div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
                    <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
                  </div>
                </div>

                {/* Subthemes */}
                {expanded[theme.id] &&
                  theme.subthemes?.map((sub) => (
                    <div
                      key={sub.id}
                      className="ml-12 grid grid-cols-12 items-center border-b py-2"
                    >
                      <div className="col-span-2">
                        P{pillar.sort_order}.T{theme.sort_order}.ST{sub.sort_order} {sub.name}
                      </div>
                      <div className="col-span-6">{sub.description}</div>
                      <div className="col-span-2 text-right">{sub.sort_order}</div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
                        <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
