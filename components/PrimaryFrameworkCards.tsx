// components/PrimaryFrameworkCards.tsx
"use client";

import React, { useState } from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  defaultOpen?: boolean;
  actions?: (
    item: Pillar | Theme | Subtheme,
    level: "pillar" | "theme" | "subtheme"
  ) => React.ReactNode;
};

function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRow = (
    item: Pillar | Theme | Subtheme,
    level: "pillar" | "theme" | "subtheme",
    children?: React.ReactNode
  ) => {
    const id = item.id;
    const isOpen = open[id] ?? defaultOpen;

    const indentMap = {
      pillar: "pl-2",
      theme: "pl-8",
      subtheme: "pl-14",
    };

    const tagColors = {
      pillar: "bg-blue-100 text-blue-800",
      theme: "bg-green-100 text-green-800",
      subtheme: "bg-red-100 text-red-800",
    };

    return (
      <React.Fragment key={id}>
        <tr>
          {/* Type / Code */}
          <td className={cn("whitespace-nowrap align-top", indentMap[level])}>
            <div className="flex items-center gap-2">
              {children ? (
                <button
                  onClick={() => toggle(id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-4 inline-block" />
              )}
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  tagColors[level]
                )}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
              <span className="text-sm font-mono">{item.code}</span>
            </div>
          </td>

          {/* Name / Description */}
          <td className="align-top">
            <div className="font-medium text-gray-900">{item.name}</div>
            {item.description && (
              <div className="text-sm text-gray-500">{item.description}</div>
            )}
          </td>

          {/* Sort Order */}
          <td className="align-top text-sm text-gray-600">{item.sort_order}</td>

          {/* Actions */}
          <td className="align-top text-right">
            {actions ? (
              actions(item, level)
            ) : (
              <div className="flex gap-2 justify-end">
                <button className="text-gray-500 hover:text-gray-700">
                  <Pencil size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Trash2 size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Plus size={16} />
                </button>
              </div>
            )}
          </td>
        </tr>

        {/* Children rows */}
        {isOpen && children}
      </React.Fragment>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="min-w-full border-collapse divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Type / Code
            </th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Name / Description
            </th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
              Sort Order
            </th>
            <th className="px-3 py-2 text-right text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pillars.map((pillar) =>
            renderRow(
              pillar,
              "pillar",
              <>
                {pillar.themes.map((theme) =>
                  renderRow(
                    theme,
                    "theme",
                    <>
                      {theme.subthemes.map((subtheme) =>
                        renderRow(subtheme, "subtheme")
                      )}
                    </>
                  )
                )}
              </>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PrimaryFrameworkCards;
