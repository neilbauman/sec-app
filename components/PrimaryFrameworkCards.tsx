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

      {/* Hierarchy */}
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

            {/* Themes (optional for now) */}
            {open[`pillar-${pillar.id}`] && (
              <div className="ml-8 text-gray-500 italic">
                {pillar.themes && pillar.themes.length > 0 ? (
                  "Themes will render here once nested query works."
                ) : (
                  "⚠ No themes found (debugging flat query step)."
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
