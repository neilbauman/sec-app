"use client";

import React from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { cn } from "@/lib/utils";

type Props = {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
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
  const renderSubtheme = (subtheme: Subtheme) => (
    <div
      key={subtheme.id}
      className="grid grid-cols-[200px_1fr_auto] items-center border-b pl-12 pr-2 py-2"
    >
      <div className="text-sm font-medium flex items-center space-x-2">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            "bg-red-100 text-red-800"
          )}
        >
          Subtheme
        </span>
        <span>{subtheme.code}</span>
      </div>
      <div>
        <div className="font-medium">{subtheme.name}</div>
        <div className="text-xs text-gray-500">{subtheme.description}</div>
      </div>
      <div className="flex justify-end space-x-2">
        {actions?.(subtheme, "subtheme")}
      </div>
    </div>
  );

  const renderTheme = (theme: Theme & { subthemes: Subtheme[] }) => (
    <div key={theme.id} className="border-b">
      <div className="grid grid-cols-[200px_1fr_auto] items-center pl-6 pr-2 py-2">
        <div className="text-sm font-medium flex items-center space-x-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              "bg-green-100 text-green-800"
            )}
          >
            Theme
          </span>
          <span>{theme.code}</span>
        </div>
        <div>
          <div className="font-medium">{theme.name}</div>
          <div className="text-xs text-gray-500">{theme.description}</div>
        </div>
        <div className="flex justify-end space-x-2">
          {actions?.(theme, "theme")}
        </div>
      </div>
      <div>{theme.subthemes.map(renderSubtheme)}</div>
    </div>
  );

  const renderPillar = (
    pillar: Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] }
  ) => (
    <div key={pillar.id} className="border rounded-md mb-4">
      <div className="grid grid-cols-[200px_1fr_auto] items-center p-2 bg-gray-50">
        <div className="text-sm font-medium flex items-center space-x-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              "bg-blue-100 text-blue-800"
            )}
          >
            Pillar
          </span>
          <span>{pillar.code}</span>
        </div>
        <div>
          <div className="font-medium">{pillar.name}</div>
          <div className="text-xs text-gray-500">{pillar.description}</div>
        </div>
        <div className="flex justify-end space-x-2">
          {actions?.(pillar, "pillar")}
        </div>
      </div>
      <div>{pillar.themes.map(renderTheme)}</div>
    </div>
  );

  return (
    <div className="border rounded-md divide-y">
      {pillars.map(renderPillar)}
    </div>
  );
}
