"use client";

import React, { useState } from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Props = {
  pillars: Pillar[];
  defaultOpen?: boolean;
  actions?: (
    item: Pillar | Theme | Subtheme,
    level: "pillar" | "theme" | "subtheme"
  ) => React.ReactNode;
};

export default function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setOpenPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderSubtheme = (subtheme: Subtheme) => (
    <div
      key={subtheme.id}
      className="grid grid-cols-[200px_1fr_80px_auto] items-center border-b pl-12 pr-2 py-2"
    >
      {/* Type + Code */}
      <div className="flex items-center space-x-2 text-sm font-medium">
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Subtheme
        </span>
        <span className="text-xs text-gray-500">{subtheme.code}</span>
      </div>
      {/* Name + Description */}
      <div>
        <div className="font-medium">{subtheme.name}</div>
        <div className="text-xs text-gray-500">{subtheme.description}</div>
      </div>
      {/* Sort Order */}
      <div className="text-sm text-gray-500">{subtheme.sort_order}</div>
      {/* Actions */}
      <div className="flex justify-end space-x-2 text-gray-400">
        <Edit size={16} />
        <Trash2 size={16} />
        <ArrowUp size={16} />
        <ArrowDown size={16} />
      </div>
    </div>
  );

  const renderTheme = (theme: Theme) => {
    const isOpen = openThemes[theme.id] ?? defaultOpen;
    return (
      <div key={theme.id} className="border-b">
        <div
          className="grid grid-cols-[200px_1fr_80px_auto] items-center pl-6 pr-2 py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleTheme(theme.id)}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Theme
            </span>
            <span className="text-xs text-gray-500">{theme.code}</span>
          </div>
          <div>
            <div className="font-medium">{theme.name}</div>
            <div className="text-xs text-gray-500">{theme.description}</div>
          </div>
          <div className="text-sm text-gray-500">{theme.sort_order}</div>
          <div className="flex justify-end space-x-2 text-gray-400">
            <Edit size={16} />
            <Trash2 size={16} />
            <ArrowUp size={16} />
            <ArrowDown size={16} />
          </div>
        </div>
        {isOpen && <div>{theme.subthemes.sort((a, b) => a.sort_order - b.sort_order).map(renderSubtheme)}</div>}
      </div>
    );
  };

  const renderPillar = (pillar: Pillar) => {
    const isOpen = openPillars[pillar.id] ?? defaultOpen;
    return (
      <div key={pillar.id} className="border rounded-md mb-4">
        <div
          className="grid grid-cols-[200px_1fr_80px_auto] items-center p-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => togglePillar(pillar.id)}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Pillar
            </span>
            <span className="text-xs text-gray-500">{pillar.code}</span>
          </div>
          <div>
            <div className="font-medium">{pillar.name}</div>
            <div className="text-xs text-gray-500">{pillar.description}</div>
          </div>
          <div className="text-sm text-gray-500">{pillar.sort_order}</div>
          <div className="flex justify-end space-x-2 text-gray-400">
            <Edit size={16} />
            <Trash2 size={16} />
            <ArrowUp size={16} />
            <ArrowDown size={16} />
          </div>
        </div>
        {isOpen && <div>{pillar.themes.sort((a, b) => a.sort_order - b.sort_order).map(renderTheme)}</div>}
      </div>
    );
  };

  return (
    <div className="border rounded-md divide-y">
      {/* Table Header */}
      <div className="grid grid-cols-[200px_1fr_80px_auto] bg-gray-100 text-sm font-medium p-2">
        <div>Type / Code</div>
        <div>Name / Description</div>
        <div>Sort Order</div>
        <div className="text-right">Actions</div>
      </div>

      {pillars.sort((a, b) => a.sort_order - b.sort_order).map(renderPillar)}
    </div>
  );
}
