"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Upload, Download } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: (Pillar & {
    themes?: (Theme & { subthemes?: Subtheme[] })[];
  })[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
};

export default function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: Props) {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-semibold">Primary Framework</h2>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-100">
            <Upload size={16} />
            Import CSV
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-100">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Pillars */}
      <div className="space-y-4">
        {pillars?.map((pillar) => (
          <div
            key={pillar.id}
            className="rounded-xl border bg-white shadow-sm"
          >
            {/* Pillar Row */}
            <div
              className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
              onClick={() => toggle(`pillar-${pillar.id}`)}
            >
              <div className="flex items-center gap-2">
                {open[`pillar-${pillar.id}`] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-800">
                  Pillar {pillar.sort_order}
                </span>
                <span className="font-medium">{pillar.name}</span>
              </div>
              <div>{actions}</div>
            </div>

            {/* Themes */}
            {open[`pillar-${pillar.id}`] && (
              <div className="ml-8 space-y-2 border-l pl-4">
                {pillar.themes && pillar.themes.length > 0 ? (
                  pillar.themes.map((theme) => (
                    <div
                      key={theme.id}
                      className="rounded-md border bg-gray-50"
                    >
                      {/* Theme Row */}
                      <div
                        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                        onClick={() => toggle(`theme-${theme.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          {open[`theme-${theme.id}`] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Theme {theme.sort_order}
                          </span>
                          <span>{theme.name}</span>
                        </div>
                        <div>{actions}</div>
                      </div>

                      {/* Subthemes (placeholder for now) */}
                      {open[`theme-${theme.id}`] && (
                        <div className="ml-6 text-gray-500 italic">
                          ⚠ Subthemes not yet loaded
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    ⚠ No themes linked to this pillar
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
