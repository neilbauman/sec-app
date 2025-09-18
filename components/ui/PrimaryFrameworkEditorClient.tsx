"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // ✅ Badge works now
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { FrameworkNode } from "@/types/framework";
import { ToolHeader } from "@/components/ui/ToolHeader"; // ✅ fixed import

type Props = {
  data: FrameworkNode[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute ref codes dynamically from sort_order + hierarchy
  const getRefCode = (
    sortOrder: number,
    parentCode: string | null = null
  ): string => {
    return parentCode ? `${parentCode}.${sortOrder}` : `P${sortOrder}`;
  };

  return (
    <div className="space-y-6">
      {/* ✅ Tool header with breadcrumbs + actions */}
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework", href: "/configuration/primary" },
        ]}
        actions={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />

      <Card>
        <CardContent className="p-4">
          {/* ✅ Table headings */}
          <div className="grid grid-cols-12 font-semibold border-b pb-2 mb-2">
            <div className="col-span-2">Type / Ref Code</div>
            <div className="col-span-6">Name / Description</div>
            <div className="col-span-2 text-center">Sort Order</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* ✅ Rows */}
          {data.map((pillar) => (
            <div key={pillar.id} className="space-y-2">
              {/* Pillar row */}
              <div className="grid grid-cols-12 items-center border-b py-2">
                <div className="col-span-2 flex items-center space-x-2">
                  <button onClick={() => toggle(pillar.id)}>
                    {expanded[pillar.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <Badge>Pillar {getRefCode(pillar.sort_order)}</Badge>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-600">
                    {pillar.description}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  {pillar.sort_order}
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Edit className="w-4 h-4 cursor-pointer" />
                  <Trash2 className="w-4 h-4 cursor-pointer" />
                </div>
              </div>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme) => (
                  <div
                    key={theme.id}
                    className="ml-6 grid grid-cols-12 items-center border-b py-2"
                  >
                    <div className="col-span-2 flex items-center space-x-2">
                      <button onClick={() => toggle(theme.id)}>
                        {expanded[theme.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <Badge>Theme {getRefCode(theme.sort_order, `${pillar.sort_order}`)}</Badge>
                    </div>
                    <div className="col-span-6">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-sm text-gray-600">
                        {theme.description}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      {theme.sort_order}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      <Edit className="w-4 h-4 cursor-pointer" />
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                ))}

              {/* Subthemes */}
              {expanded[pillar.id] &&
                pillar.themes?.map(
                  (theme) =>
                    expanded[theme.id] &&
                    theme.subthemes?.map((sub) => (
                      <div
                        key={sub.id}
                        className="ml-12 grid grid-cols-12 items-center border-b py-2"
                      >
                        <div className="col-span-2 flex items-center space-x-2">
                          <Badge>
                            Subtheme{" "}
                            {getRefCode(sub.sort_order, `${pillar.sort_order}.${theme.sort_order}`)}
                          </Badge>
                        </div>
                        <div className="col-span-6">
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-sm text-gray-600">
                            {sub.description}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          {sub.sort_order}
                        </div>
                        <div className="col-span-2 flex justify-end space-x-2">
                          <Edit className="w-4 h-4 cursor-pointer" />
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </div>
                      </div>
                    ))
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
