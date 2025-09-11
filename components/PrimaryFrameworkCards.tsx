// /components/PrimaryFrameworkCards.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, PenSquare, Trash2, Plus } from "lucide-react";
import { Tag, ActionIcon } from "@/lib/ui";
import { Pillar, Theme, Subtheme } from "@/types/framework";

type NestedPillar = Pillar & {
  themes?: (Theme & { subthemes?: Subtheme[] })[];
};

export function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: {
  pillars: NestedPillar[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_100px_120px] items-center border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
        <div>Name / Description</div>
        <div className="text-center">Sort Order</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}
      <div>
        {pillars.map((pillar) => (
          <PillarRow key={pillar.id} pillar={pillar} defaultOpen={defaultOpen} />
        ))}
      </div>

      {/* Right-side global actions (CSV, etc.) */}
      {actions && (
        <div className="border-t px-4 py-2 text-right">{actions}</div>
      )}
    </div>
  );
}

function PillarRow({ pillar, defaultOpen }: { pillar: NestedPillar; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border-b last:border-0">
      {/* Pillar row */}
      <div className="grid grid-cols-[2fr_100px_120px] items-center px-4 py-2 hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-gray-700">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <Tag color="blue">Pillar</Tag>
          <span className="text-xs text-gray-400">{pillar.code}</span>
          <span className="font-medium">{pillar.name}</span>
        </div>
        <div className="text-center text-sm text-gray-600">{pillar.sort_order ?? "-"}</div>
        <div className="flex items-center justify-center gap-2">
          <ActionIcon disabled title="Edit Pillar"><PenSquare className="h-4 w-4" /></ActionIcon>
          <ActionIcon disabled title="Delete Pillar"><Trash2 className="h-4 w-4" /></ActionIcon>
          <ActionIcon disabled title="Add Theme"><Plus className="h-4 w-4" /></ActionIcon>
        </div>
      </div>

      {/* Themes */}
      {open && pillar.themes?.map((theme) => (
        <ThemeRow key={theme.id} theme={theme} />
      ))}
    </div>
  );
}

function ThemeRow({ theme }: { theme: Theme & { subthemes?: Subtheme[] } }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t">
      <div className="grid grid-cols-[2fr_100px_120px] items-center px-8 py-2 hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-gray-700">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <Tag color="green">Theme</Tag>
          <span className="text-xs text-gray-400">{theme.code}</span>
          <span>{theme.name}</span>
        </div>
        <div className="text-center text-sm text-gray-600">{theme.sort_order ?? "-"}</div>
        <div className="flex items-center justify-center gap-2">
          <ActionIcon disabled title="Edit Theme"><PenSquare className="h-4 w-4" /></ActionIcon>
          <ActionIcon disabled title="Delete Theme"><Trash2 className="h-4 w-4" /></ActionIcon>
          <ActionIcon disabled title="Add Subtheme"><Plus className="h-4 w-4" /></ActionIcon>
        </div>
      </div>

      {open && theme.subthemes?.map((subtheme) => (
        <SubthemeRow key={subtheme.id} subtheme={subtheme} />
      ))}
    </div>
  );
}

function SubthemeRow({ subtheme }: { subtheme: Subtheme }) {
  return (
    <div className="grid grid-cols-[2fr_100px_120px] items-center px-12 py-2 hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <Tag color="red">Subtheme</Tag>
        <span className="text-xs text-gray-400">{subtheme.code}</span>
        <span>{subtheme.name}</span>
      </div>
      <div className="text-center text-sm text-gray-600">{subtheme.sort_order ?? "-"}</div>
      <div className="flex items-center justify-center gap-2">
        <ActionIcon disabled title="Edit Subtheme"><PenSquare className="h-4 w-4" /></ActionIcon>
        <ActionIcon disabled title="Delete Subtheme"><Trash2 className="h-4 w-4" /></ActionIcon>
      </div>
    </div>
  );
}
