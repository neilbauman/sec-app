"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { Tag, ActionIcon } from "@/lib/ui";
import { Pillar, Theme, Subtheme } from "@/types/framework";

interface Props {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}

export function PrimaryFrameworkCards({ pillars, defaultOpen = false, actions }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  const renderRow = (
    level: "pillar" | "theme" | "subtheme",
    item: Pillar | Theme | Subtheme
  ) => {
    const id = (item as any).id;
    const isOpen = openIds.has(id);
    const hasChildren =
      level === "pillar"
        ? (item as Pillar).themes?.length > 0
        : level === "theme"
        ? (item as Theme).subthemes?.length > 0
        : false;

    const color = level === "pillar" ? "blue" : level === "theme" ? "green" : "red";

    return (
      <div key={id} className="flex items-center gap-3 border-b py-2 text-sm">
        {/* Expand/collapse caret */}
        <div className="w-5">
          {hasChildren && (
            <button onClick={() => toggle(id)} className="text-gray-500 hover:text-gray-700">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Tag + code */}
        <div className="w-40 flex items-center gap-2">
          <Tag color={color}>{level}</Tag>
          <span className="text-xs text-gray-500">{(item as any).code}</span>
        </div>

        {/* Name */}
        <div className="flex-1 font-medium text-gray-900">{(item as any).name}</div>

        {/* Sort order */}
        <div className="w-24 text-center text-gray-500">{(item as any).sort_order}</div>

        {/* Actions */}
        <div className="w-28 flex items-center gap-2">
          <ActionIcon title="Add" disabled>
            <Plus className="h-4 w-4" />
          </ActionIcon>
          <ActionIcon title="Edit" disabled>
            <Pencil className="h-4 w-4" />
          </ActionIcon>
          <ActionIcon title="Delete" disabled>
            <Trash2 className="h-4 w-4" />
          </ActionIcon>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Header row */}
      <div className="grid grid-cols-[20px_160px_1fr_96px_112px] gap-3 border-b bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
        <div />
        <div>Type / Code</div>
        <div>Name</div>
        <div className="text-center">Sort Order</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Data rows */}
      <div className="divide-y">
        {pillars.map((pillar) => (
          <div key={pillar.id}>
            {renderRow("pillar", pillar)}
            {openIds.has(pillar.id) &&
              pillar.themes?.map((theme) => (
                <div key={theme.id} className="ml-6">
                  {renderRow("theme", theme)}
                  {openIds.has(theme.id) &&
                    theme.subthemes?.map((sub) => (
                      <div key={sub.id} className="ml-6">
                        {renderRow("subtheme", sub)}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Bottom actions bar */}
      {actions && <div className="p-3 border-t">{actions}</div>}
    </div>
  );
}
