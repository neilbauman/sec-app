// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

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
      {/* Bulk editing controls */}
      <div className="flex justify-end">
        <Card className="w-fit shadow-sm">
          <CardContent className="flex items-center gap-3 p-3">
            <span className="text-sm font-medium text-gray-700">
              Bulk editing
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Import not ready yet")}
              >
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Export not ready yet")}
              >
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="grid grid-cols-12 gap-4 px-2 text-sm font-medium text-gray-500 border-b pb-2">
        <div className="col-span-3">Type / Ref Code</div>
        <div className="col-span-6">Name / Description</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {framework.map((pillar) => (
        <div key={pillar.id} className="space-y-2">
          {/* Pillar Row */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center gap-2">
              <button onClick={() => toggleExpand(pillar.id)}>
                {expanded[pillar.id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <Badge variant="default">Pillar</Badge>
              <span className="text-xs text-gray-500">
                {pillar.ref_code || pillar.sort_order}
              </span>
            </div>
            <div className="col-span-6">
              <div className="font-medium">{pillar.name}</div>
              <div className="text-xs text-gray-500">{pillar.description}</div>
            </div>
            <div className="col-span-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Themes */}
          {expanded[pillar.id] &&
            pillar.themes?.map((theme: Theme) => (
              <div key={theme.id} className="ml-6 space-y-2">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-2">
                    <button onClick={() => toggleExpand(theme.id)}>
                      {expanded[theme.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <Badge variant="success">Theme</Badge>
                    <span className="text-xs text-gray-500">
                      {theme.ref_code || theme.sort_order}
                    </span>
                  </div>
                  <div className="col-span-6">
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-xs text-gray-500">
                      {theme.description}
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Subthemes */}
                {expanded[theme.id] &&
                  theme.subthemes?.map((sub: Subtheme) => (
                    <div
                      key={sub.id}
                      className="ml-6 grid grid-cols-12 gap-4 items-center"
                    >
                      <div className="col-span-3 flex items-center gap-2">
                        <Badge variant="danger">Subtheme</Badge>
                        <span className="text-xs text-gray-500">
                          {sub.ref_code || sub.sort_order}
                        </span>
                      </div>
                      <div className="col-span-6">
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-xs text-gray-500">
                          {sub.description}
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
