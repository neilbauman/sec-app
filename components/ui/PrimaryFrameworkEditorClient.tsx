// /components/ui/PrimaryFrameworkEditorClient.tsx

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar } from "@/types/framework";
import { ToolHeader } from "@/components/ui/ToolHeader";

type Props = {
  data: Pillar[]; // ✅ use `data` to match page.tsx
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
        group="Configuration"
        actionButtons={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-12 font-semibold border-b bg-gray-50 p-2">
            <div className="col-span-2">Type / Ref Code</div>
            <div className="col-span-6">Name / Description</div>
            <div className="col-span-2">Sort Order</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {data.map((pillar) => (
            <div key={pillar.id} className="border-b">
              <div className="grid grid-cols-12 items-center p-2">
                <div className="col-span-2 flex items-center">
                  <button onClick={() => toggle(pillar.id)} className="mr-2">
                    {expanded[pillar.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <Badge className="bg-blue-100 text-blue-800">Pillar</Badge>
                </div>
                <div className="col-span-6">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-600">{pillar.description}</div>
                </div>
                <div className="col-span-2">{pillar.sort_order}</div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Edit className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-600" />
                  <Trash2 className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-600" />
                </div>
              </div>

              {expanded[pillar.id] && pillar.themes?.map((theme) => (
                <div
                  key={theme.id}
                  className="ml-6 grid grid-cols-12 items-center border-b py-2"
                >
                  <div className="col-span-2">
                    <Badge className="bg-green-100 text-green-800">Theme</Badge>
                  </div>
                  <div className="col-span-6">
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-sm text-gray-600">{theme.description}</div>
                  </div>
                  <div className="col-span-2">{theme.sort_order}</div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <Edit className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-600" />
                    <Trash2 className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-600" />
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
