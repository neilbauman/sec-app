"use client";

// /components/ui/PrimaryFrameworkEditorClient.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge"; // ✅ fixed import
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ToolHeader } from "@/components/ui/ToolHeader";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
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
      />

      {/* Bulk editing card */}
      <div className="flex justify-end">
        <Card className="p-3">
          <h3 className="text-sm font-semibold mb-2">Bulk Editing</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert("Import not ready yet")}
            >
              Import CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert("Export not ready yet")}
            >
              Export CSV
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-12 border-b bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
              <div className="col-span-3 flex items-center">Type / Ref Code</div>
              <div className="col-span-6">Name / Description</div>
              <div className="col-span-2 text-center">Sort Order</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {data.map((pillar, pIndex) => (
              <div key={pillar.id}>
                {/* Pillar Row */}
                <div className="grid grid-cols-12 items-center border-b px-4 py-2">
                  <div className="col-span-3 flex items-center gap-2">
                    <button onClick={() => toggle(pillar.id)}>
                      {expanded[pillar.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <Badge variant="default">Pillar</Badge>
                    <span>{pIndex + 1}</span>
                  </div>
                  <div className="col-span-6">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-sm text-gray-600">
                      {pillar.description}
                    </div>
                  </div>
                  <div className="col-span-2 text-center">{pillar.sort_order}</div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                    <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                  </div>
                </div>

                {/* Themes */}
                {expanded[pillar.id] &&
                  pillar.themes?.map((theme, tIndex) => (
                    <div key={theme.id}>
                      <div className="grid grid-cols-12 items-center border-b px-4 py-2 ml-6">
                        <div className="col-span-3 flex items-center gap-2">
                          <button onClick={() => toggle(theme.id)}>
                            {expanded[theme.id] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <Badge variant="success">Theme</Badge>
                          <span>{tIndex + 1}</span>
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
                        <div className="col-span-1 flex justify-end gap-2">
                          <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                          <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                        </div>
                      </div>

                      {/* Subthemes */}
                      {expanded[theme.id] &&
                        theme.subthemes?.map((sub, sIndex) => (
                          <div
                            key={sub.id}
                            className="grid grid-cols-12 items-center border-b px-4 py-2 ml-12"
                          >
                            <div className="col-span-3 flex items-center gap-2">
                              <Badge variant="danger">Subtheme</Badge>
                              <span>{sIndex + 1}</span>
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
                            <div className="col-span-1 flex justify-end gap-2">
                              <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                              <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
