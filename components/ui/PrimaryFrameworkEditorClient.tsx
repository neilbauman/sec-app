"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import { ToolHeader } from "@/components/ui/ToolHeader";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSubthemes = (subthemes: Subtheme[]) =>
    subthemes.map((sub) => (
      <div
        key={sub.id}
        className="ml-12 grid grid-cols-12 items-center border-b py-2"
      >
        <div className="col-span-3 flex items-center gap-2">
          <Badge variant="danger">Subtheme</Badge>
          <span className="text-sm text-gray-500">{sub.sort_order}</span>
        </div>
        <div className="col-span-6">
          <div className="font-medium">{sub.name}</div>
          <div className="text-sm text-gray-500">{sub.description}</div>
        </div>
        <div className="col-span-2 text-center">{sub.sort_order}</div>
        <div className="col-span-1 flex gap-2">
          <Edit className="w-4 h-4 cursor-pointer" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
        </div>
      </div>
    ));

  const renderThemes = (themes: Theme[]) =>
    themes.map((theme) => (
      <div key={theme.id}>
        <div
          className="ml-6 grid grid-cols-12 items-center border-b py-2"
        >
          <button
            onClick={() => toggle(theme.id)}
            className="col-span-1 flex items-center"
          >
            {expanded[theme.id] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <div className="col-span-2 flex items-center gap-2">
            <Badge variant="success">Theme</Badge>
            <span className="text-sm text-gray-500">{theme.sort_order}</span>
          </div>
          <div className="col-span-6">
            <div className="font-medium">{theme.name}</div>
            <div className="text-sm text-gray-500">{theme.description}</div>
          </div>
          <div className="col-span-2 text-center">{theme.sort_order}</div>
          <div className="col-span-1 flex gap-2">
            <Edit className="w-4 h-4 cursor-pointer" />
            <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
          </div>
        </div>
        {expanded[theme.id] && theme.subthemes && renderSubthemes(theme.subthemes)}
      </div>
    ));

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        group="Configuration"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
        actions={[
          { label: "Import CSV", onClick: () => alert("Import not ready yet") },
          { label: "Export CSV", onClick: () => alert("Export not ready yet") },
        ]}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="grid grid-cols-12 font-medium border-b bg-gray-50 p-3 text-sm">
          <div className="col-span-3">Type / Ref Code</div>
          <div className="col-span-6">Name / Description</div>
          <div className="col-span-2 text-center">Sort Order</div>
          <div className="col-span-1">Actions</div>
        </div>

        {data.map((pillar) => (
          <div key={pillar.id}>
            <div className="grid grid-cols-12 items-center border-b py-2">
              <button
                onClick={() => toggle(pillar.id)}
                className="col-span-1 flex items-center"
              >
                {expanded[pillar.id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <div className="col-span-2 flex items-center gap-2">
                <Badge variant="default">Pillar</Badge>
                <span className="text-sm text-gray-500">{pillar.sort_order}</span>
              </div>
              <div className="col-span-6">
                <div className="font-medium">{pillar.name}</div>
                <div className="text-sm text-gray-500">{pillar.description}</div>
              </div>
              <div className="col-span-2 text-center">{pillar.sort_order}</div>
              <div className="col-span-1 flex gap-2">
                <Edit className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
              </div>
            </div>
            {expanded[pillar.id] && pillar.themes && renderThemes(pillar.themes)}
          </div>
        ))}
      </div>
    </div>
  );
}
