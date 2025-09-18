"use client";

// /components/ui/PrimaryFrameworkEditorClient.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex justify-between items-start">
        <ToolHeader
          title="Primary Framework Editor"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Configuration", href: "/configuration" },
            { label: "Primary Framework", href: "/configuration/primary" },
          ]}
          group="Configuration"
        />
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2">Bulk Editing</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Import CSV
            </Button>
            <Button size="sm" variant="outline">
              Export CSV
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
            <div></div>
            <div>Type / Ref Code</div>
            <div>Name / Description</div>
            <div className="text-center">Sort Order</div>
            <div className="text-right">Actions</div>
          </div>

          {data.map((pillar) => (
            <div key={pillar.id}>
              {/* Pillar */}
              <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center border-b px-4 py-2">
                <button onClick={() => toggleExpand(pillar.id)} className="mr-1">
                  {expanded[pillar.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <Badge variant="default" className="ml-1">
                  Pillar
                </Badge>
                <div>
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-500">{pillar.description}</div>
                </div>
                <div className="text-center">{pillar.sort_order}</div>
                <div className="flex gap-2 justify-end">
                  <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                  <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                </div>
              </div>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme) => (
                  <div key={theme.id}>
                    <div className="ml-6 grid grid-cols-[auto_auto_1fr_auto_auto] items-center border-b px-4 py-2">
                      <button onClick={() => toggleExpand(theme.id)} className="mr-1">
                        {expanded[theme.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge variant="success" className="ml-1">
                        Theme
                      </Badge>
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-sm text-gray-500">{theme.description}</div>
                      </div>
                      <div className="text-center">{theme.sort_order}</div>
                      <div className="flex gap-2 justify-end">
                        <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                        <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                      </div>
                    </div>

                    {/* Subthemes */}
                    {expanded[theme.id] &&
                      theme.subthemes?.map((sub) => (
                        <div
                          key={sub.id}
                          className="ml-12 grid grid-cols-[auto_auto_1fr_auto_auto] items-center border-b px-4 py-2"
                        >
                          <div></div>
                          <Badge variant="danger" className="ml-1">
                            Subtheme
                          </Badge>
                          <div>
                            <div className="font-medium">{sub.name}</div>
                            <div className="text-sm text-gray-500">{sub.description}</div>
                          </div>
                          <div className="text-center">{sub.sort_order}</div>
                          <div className="flex gap-2 justify-end">
                            <Edit size={16} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                            <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
