// components/PrimaryFrameworkCards.tsx

"use client";

import React from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { cn } from "@/lib/utils";

type Props = {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  defaultOpen?: boolean;
  actions?: (item: Pillar | Theme | Subtheme, level: "pillar" | "theme" | "subtheme") => React.ReactNode;
};

function getIndent(level: "pillar" | "theme" | "subtheme") {
  switch (level) {
    case "pillar":
      return "pl-0";
    case "theme":
      return "pl-6";
    case "subtheme":
      return "pl-12";
  }
}

const PrimaryFrameworkCards: React.FC<Props> = ({ pillars, defaultOpen = false, actions }) => {
  return (
    <div className="card divide-y">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-gray-700 text-sm">
        <div className="col-span-3">Type / Code</div>
        <div className="col-span-6">Name / Description</div>
        <div className="col-span-2">Sort Order</div>
        <div className="col-span-1">Actions</div>
      </div>

      {pillars.map((pillar) => (
        <React.Fragment key={pillar.id}>
          {/* Pillar */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 items-center">
            <div className={cn("col-span-3", getIndent("pillar"))}>
              <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Pillar
              </span>
              <span className="ml-2">{pillar.code}</span>
            </div>
            <div className={cn("col-span-6", getIndent("pillar"))}>
              <div className="font-semibold">{pillar.name}</div>
              <div className="text-sm text-gray-600">{pillar.description}</div>
            </div>
            <div className="col-span-2">{pillar.sort_order}</div>
            <div className="col-span-1">{actions?.(pillar, "pillar")}</div>
          </div>

          {pillar.themes.map((theme) => (
            <React.Fragment key={theme.id}>
              {/* Theme */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 items-center">
                <div className={cn("col-span-3", getIndent("theme"))}>
                  <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Theme
                  </span>
                  <span className="ml-2">{theme.code}</span>
                </div>
                <div className={cn("col-span-6", getIndent("theme"))}>
                  <div className="font-semibold">{theme.name}</div>
                  <div className="text-sm text-gray-600">{theme.description}</div>
                </div>
                <div className="col-span-2">{theme.sort_order}</div>
                <div className="col-span-1">{actions?.(theme, "theme")}</div>
              </div>

              {theme.subthemes.map((subtheme) => (
                <div key={subtheme.id} className="grid grid-cols-12 gap-4 px-4 py-2 items-center">
                  <div className={cn("col-span-3", getIndent("subtheme"))}>
                    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      Subtheme
                    </span>
                    <span className="ml-2">{subtheme.code}</span>
                  </div>
                  <div className={cn("col-span-6", getIndent("subtheme"))}>
                    <div className="font-semibold">{subtheme.name}</div>
                    <div className="text-sm text-gray-600">{subtheme.description}</div>
                  </div>
                  <div className="col-span-2">{subtheme.sort_order}</div>
                  <div className="col-span-1">{actions?.(subtheme, "subtheme")}</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PrimaryFrameworkCards;
