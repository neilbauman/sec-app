// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import type { Pillar } from "@/types/framework";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework", href: "/configuration/primary" },
        ]}
        actionButtons={[
          {
            label: "Import CSV",
            onClick: () => alert("Import not ready yet"),
          },
          {
            label: "Export CSV",
            onClick: () => alert("Export not ready yet"),
          },
        ]}
      />

      <Card>
        <CardContent>
          <div className="grid grid-cols-12 font-semibold border-b py-2">
            <div className="col-span-2">Type / Ref Code</div>
            <div className="col-span-6">Name / Description</div>
            <div className="col-span-2 text-right">Sort Order</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {framework.map((pillar) => (
            <div key={pillar.id}>
              <div className="grid grid-cols-12 items-center border-b py-2">
                <div className="col-span-2 flex items-center">
                  <button
                    onClick={() => toggleExpand(pillar.id)}
                    className="mr-2"
                  >
                    {expanded[pillar.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  <Badge className="bg-blue-100 text-blue-800">Pillar</Badge>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-500">
                    {pillar.description}
                  </div>
                </div>
                <div className="col-span-2 text-right">{pillar.sort_order}</div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Edit className="cursor-pointer text-gray-600" size={16} />
                  <Trash2 className="cursor-pointer text-red-600" size={16} />
                </div>
              </div>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme) => (
                  <div
                    key={theme.id}
                    className="ml-6 grid grid-cols-12 items-center border-b py-2"
                  >
                    <div className="col-span-2 flex items-center">
                      <button
                        onClick={() => toggleExpand(theme.id)}
                        className="mr-2"
                      >
                        {expanded[theme.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge className="bg-green-100 text-green-800">
                        Theme
                      </Badge>
                    </div>
                    <div className="col-span-6">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-sm text-gray-500">
                        {theme.description}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      {theme.sort_order}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      <Edit
                        className="cursor-pointer text-gray-600"
                        size={16}
                      />
                      <Trash2
                        className="cursor-pointer text-red-600"
                        size={16}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
