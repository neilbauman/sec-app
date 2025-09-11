// /components/PrimaryFrameworkCards.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Pencil, Plus } from "lucide-react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { Tag, ActionIcon } from "@/lib/ui";

interface Props {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  defaultOpen?: boolean;
  actions?: (item: Pillar | Theme | Subtheme, level: "pillar" | "theme" | "subtheme") => React.ReactNode;
}

export function PrimaryFrameworkCards({ pillars, defaultOpen = false, actions }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
          <tr>
            <th className="px-4 py-2 w-1/6">Type / Code</th>
            <th className="px-4 py-2 w-3/6">Name / Description</th>
            <th className="px-4 py-2 w-1/6">Sort Order</th>
            <th className="px-4 py-2 w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pillars.map((pillar) => (
            <FrameworkRow
              key={pillar.id}
              item={pillar}
              level="pillar"
              depth={0}
              defaultOpen={defaultOpen}
              actions={actions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FrameworkRow({
  item,
  level,
  depth,
  defaultOpen = false,
  actions,
}: {
  item: Pillar | Theme | Subtheme & { themes?: Theme[]; subthemes?: Subtheme[] };
  level: "pillar" | "theme" | "subtheme";
  depth: number;
  defaultOpen?: boolean;
  actions?: (item: Pillar | Theme | Subtheme, level: "pillar" | "theme" | "subtheme") => React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const children =
    level === "pillar"
      ? (item as Pillar).themes
      : level === "theme"
      ? (item as Theme).subthemes
      : undefined;

  const color = level === "pillar" ? "blue" : level === "theme" ? "green" : "red";
  const label = level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme";

  // Increase indent for clarity
  const indent = depth * 24;

  return (
    <>
      <tr className="align-top">
        {/* Type / Code */}
        <td className="px-4 py-2 whitespace-nowrap">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
            {children && (
              <button
                onClick={() => setOpen(!open)}
                className="text-gray-500 hover:text-gray-700"
              >
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            <div className="flex items-center gap-2">
              <Tag color={color}>{label}</Tag>
              <span className="text-xs text-gray-500">{item.code}</span>
            </div>
          </div>
        </td>

        {/* Name / Description */}
        <td className="px-4 py-2">
          <div className="flex flex-col" style={{ paddingLeft: `${indent}px` }}>
            <span className="font-medium text-gray-900">{item.name}</span>
            {item.description && (
              <span className="text-xs text-gray-500">{item.description}</span>
            )}
          </div>
        </td>

        {/* Sort Order */}
        <td className="px-4 py-2 text-gray-500">{item.sort_order}</td>

        {/* Actions */}
        <td className="px-4 py-2">
          <div className="flex items-center gap-2">
            <ActionIcon title="Edit" disabled>
              <Pencil className="h-4 w-4" />
            </ActionIcon>
            <ActionIcon title="Delete" disabled>
              <Trash2 className="h-4 w-4" />
            </ActionIcon>
            <ActionIcon title="Add child" disabled>
              <Plus className="h-4 w-4" />
            </ActionIcon>
            {actions?.(item, level)}
          </div>
        </td>
      </tr>

      {/* Children */}
      {open &&
        children?.map((child) => (
          <FrameworkRow
            key={child.id}
            item={child}
            level={level === "pillar" ? "theme" : "subtheme"}
            depth={depth + 1}
            actions={actions}
          />
        ))}
    </>
  );
}
