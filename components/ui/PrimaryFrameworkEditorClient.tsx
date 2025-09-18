// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      />

      {/* Bulk Editing */}
      <div className="flex justify-end">
        <Card className="w-fit">
          <CardContent className="p-3">
            <h3 className="text-sm font-semibold mb-2">Bulk Editing</h3>
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

      {/* Table Header */}
      <div className="grid grid-cols-12 font-semibold border-b pb-2">
        <div className="col-span-3">Type / Ref Code</div>
        <div className="col-span-6">Name / Description</div>
        <div className="col-span-2 text-center">Sort Order</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Rows */}
      {data.map((pillar) => (
        <div key={pillar.id} className="border-b py-2">
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-3 flex items-center gap-2">
              <button onClick={() => toggleExpand(pillar.id)}>
                {expanded[pillar.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <Badge variant="default">Pillar</Badge>
              <span className="font-medium">{pillar.id}</span>
            </div>
            <div className="col-span-6">
              <div className="font-medium">{pillar.name}</div>
              <div className="text-sm text-gray-500">{pillar.description}</div>
            </div>
            <div className="col-span-2 text-center">{pillar.sort_order}</div>
            <div className="col-span-1 flex justify-end gap-2">
              <Edit size={16} className="cursor-pointer text-gray-600" />
              <Trash2 size={16} className="cursor-pointer text-red-500" />
            </div>
          </div>

          {/* Themes */}
          {expanded[pillar.id] &&
            pillar.themes?.map((theme) => (
              <div
                key={theme.id}
                className="ml-6 grid grid-cols-12 items-center border-b py-2"
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
                  <span className="font-medium">{theme.id}</span>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-gray-500">{theme.description}</div>
                </div>
                <div className="col-span-2 text-center">{theme.sort_order}</div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Edit size={16} className="cursor-pointer text-gray-600" />
                  <Trash2 size={16} className="cursor-pointer text-red-500" />
                </div>
              </div>
            ))}

          {/* Subthemes */}
          {pillar.themes?.map(
            (theme) =>
              expanded[theme.id] &&
              theme.subthemes?.map((sub) => (
                <div
                  key={sub.id}
                  className="ml-12 grid grid-cols-12 items-center border-b py-2"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <Badge variant="destructive">Subtheme</Badge>
                    <span className="font-medium">{sub.id}</span>
                  </div>
                  <div className="col-span-6">
                    <div className="font-medium">{sub.name}</div>
                    <div className="text-sm text-gray-500">{sub.description}</div>
                  </div>
                  <div className="col-span-2 text-center">{sub.sort_order}</div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <Edit size={16} className="cursor-pointer text-gray-600" />
                    <Trash2 size={16} className="cursor-pointer text-red-500" />
                  </div>
                </div>
              ))
          )}
        </div>
      ))}
    </div>
  );
}
