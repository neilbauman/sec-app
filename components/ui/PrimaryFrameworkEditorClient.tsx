"use client";

// /components/ui/PrimaryFrameworkEditorClient.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ToolHeader } from "@/components/ui/ToolHeader";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework", href: "/configuration/primary" },
        ]}
        group="Configuration"
        actions={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />

      <Card>
        <CardContent>
          <div className="grid grid-cols-12 border-b bg-gray-50 px-4 py-2 font-medium text-sm text-gray-600">
            <div className="col-span-3">Type / Ref Code</div>
            <div className="col-span-6">Name / Description</div>
            <div className="col-span-2">Sort Order</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Pillars */}
          {data.map((pillar) => (
            <div key={pillar.id}>
              <div className="grid grid-cols-12 items-center border-b px-4 py-2">
                <div className="col-span-3 flex items-center gap-2">
                  <button onClick={() => toggleExpand(pillar.id)}>
                    {expanded[pillar.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  <Badge variant="default">Pillar</Badge>
                  <span className="text-sm text-gray-500">{pillar.sort_order}</span>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-500">{pillar.description}</div>
                </div>
                <div className="col-span-2">{pillar.sort_order}</div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                  <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                </div>
              </div>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme: Theme) => (
                  <div
                    key={theme.id}
                    className="ml-6 grid grid-cols-12 items-center border-b px-4 py-2"
                  >
                    <div className="col-span-3 flex items-center gap-2">
                      <button onClick={() => toggleExpand(theme.id)}>
                        {expanded[theme.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge variant="success">Theme</Badge>
                      <span className="text-sm text-gray-500">{theme.sort_order}</span>
                    </div>
                    <div className="col-span-6">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-sm text-gray-500">{theme.description}</div>
                    </div>
                    <div className="col-span-2">{theme.sort_order}</div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                      <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                    </div>
                  </div>
                ))}

              {/* Subthemes inside Themes */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme: Theme) =>
                  expanded[theme.id]
                    ? theme.subthemes?.map((sub: Subtheme) => (
                        <div
                          key={sub.id}
                          className="ml-12 grid grid-cols-12 items-center border-b px-4 py-2"
                        >
                          <div className="col-span-3 flex items-center gap-2">
                            <Badge variant="danger">Subtheme</Badge>
                            <span className="text-sm text-gray-500">{sub.sort_order}</span>
                          </div>
                          <div className="col-span-6">
                            <div className="font-medium">{sub.name}</div>
                            <div className="text-sm text-gray-500">{sub.description}</div>
                          </div>
                          <div className="col-span-2">{sub.sort_order}</div>
                          <div className="col-span-1 flex justify-end gap-2">
                            <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                            <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </div>
                      ))
                    : null
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
