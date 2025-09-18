"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

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
      {/* Bulk editing inline card */}
      <div className="flex justify-end">
        <Card className="w-fit shadow-sm">
          <CardContent className="flex items-center gap-3 p-3">
            <span className="text-sm font-medium text-gray-600">Bulk editing</span>
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
          </CardContent>
        </Card>
      </div>

      {/* Framework table */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-12 font-semibold border-b pb-2 text-sm text-gray-700">
            <div className="col-span-3">Type / Ref Code</div>
            <div className="col-span-6">Name / Description</div>
            <div className="col-span-2 text-center">Sort Order</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Pillars */}
          {data.map((pillar) => (
            <div key={pillar.id}>
              <div className="grid grid-cols-12 items-center border-b py-2">
                <div className="col-span-3 flex items-center gap-2">
                  <button onClick={() => toggle(pillar.id)} className="focus:outline-none">
                    {expanded[pillar.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <Badge variant="default">Pillar</Badge>
                  <span className="text-xs text-gray-500">{pillar.sort_order}</span>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-xs text-gray-500">{pillar.description}</div>
                </div>
                <div className="col-span-2 text-center">{pillar.sort_order}</div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                  <Trash2 className="h-4 w-4 cursor-pointer text-gray-600" />
                </div>
              </div>

              {/* Themes inside expanded Pillar */}
              {expanded[pillar.id] &&
                pillar.themes?.map((theme) => (
                  <div key={theme.id} className="ml-6">
                    <div className="grid grid-cols-12 items-center border-b py-2">
                      <div className="col-span-3 flex items-center gap-2">
                        <button
                          onClick={() => toggle(theme.id)}
                          className="focus:outline-none"
                        >
                          {expanded[theme.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <Badge variant="success">Theme</Badge>
                        <span className="text-xs text-gray-500">{theme.sort_order}</span>
                      </div>
                      <div className="col-span-6">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-gray-500">{theme.description}</div>
                      </div>
                      <div className="col-span-2 text-center">{theme.sort_order}</div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                        <Trash2 className="h-4 w-4 cursor-pointer text-gray-600" />
                      </div>
                    </div>

                    {/* Subthemes inside expanded Theme */}
                    {expanded[theme.id] &&
                      theme.subthemes?.map((sub) => (
                        <div key={sub.id} className="ml-12">
                          <div className="grid grid-cols-12 items-center border-b py-2">
                            <div className="col-span-3 flex items-center gap-2">
                              <Badge variant="danger">Subtheme</Badge>
                              <span className="text-xs text-gray-500">{sub.sort_order}</span>
                            </div>
                            <div className="col-span-6">
                              <div className="font-medium">{sub.name}</div>
                              <div className="text-xs text-gray-500">{sub.description}</div>
                            </div>
                            <div className="col-span-2 text-center">{sub.sort_order}</div>
                            <div className="col-span-1 flex justify-end gap-2">
                              <Edit className="h-4 w-4 cursor-pointer text-gray-600" />
                              <Trash2 className="h-4 w-4 cursor-pointer text-gray-600" />
                            </div>
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
