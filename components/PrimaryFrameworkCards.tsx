// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework"; // <-- use canonical types

type Actions = {
  updateName?: (entity: "pillar"|"theme"|"subtheme", code: string, name: string) => Promise<void>;
  updateDescription?: (entity: "pillar"|"theme"|"subtheme", code: string, description: string) => Promise<void>;
  updateSort?: (entity: "pillar"|"theme"|"subtheme", code: string, sort: number) => Promise<void>;
  bumpSort?: (entity: "pillar"|"theme"|"subtheme", code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions; // optional, since we’re currently read-only
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // group themes by pillar_code
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      const key = (t as any).pillar_code ?? (t as any).parent_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    return m;
  }, [themes]);

  // group subthemes by theme_code
  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const key = (s as any).theme_code ?? (s as any).parent_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    return m;
  }, [subthemes]);

  const sortNum = (n: unknown) =>
    typeof n === "number" ? n : Number(n ?? 0) || 0;

  return (
    <div className="rounded-xl border bg-white">
      {/* header row */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center px-4 py-3 text-xs font-medium text-slate-500 border-b">
        <span>Name / Description</span>
        <span className="text-right pr-4">Sort Order</span>
        <span className="text-right pr-2">Actions</span>
      </div>

      {/* rows */}
      <div className="divide-y">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => sortNum((a as any).sort_order) - sortNum((b as any).sort_order))
          .map((p) => {
            const isOpen = openPillars[p.code] ?? defaultOpen;
            const pillarThemes = (themesByPillar[p.code] ?? []).slice()
              .sort((a, b) => sortNum((a as any).sort_order) - sortNum((b as any).sort_order));

            return (
              <div key={p.code} className="bg-white">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-center px-4 py-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPillars((s) => ({ ...s, [p.code]: !isOpen }))
                      }
                      className="mt-1 h-5 w-5 flex items-center justify-center rounded hover:bg-slate-100"
                      aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                    >
                      <span className="text-slate-500">{isOpen ? "▾" : "▸"}</span>
                    </button>

                    <span className="inline-flex items-center gap-2">
                      <span className="rounded bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 border border-blue-100">
                        Pillar
                      </span>
                      <span className="text-xs font-medium text-slate-400">{p.code}</span>
                      <span className="text-sm font-medium text-slate-900">{p.name}</span>
                    </span>
                  </div>

                  <div className="text-right pr-4 text-sm text-slate-700">
                    {sortNum((p as any).sort_order)}
                  </div>

                  <div className="text-right pr-2">
                    {/* placeholder action buttons; disabled until wired */}
                    <button className="text-slate-400 cursor-default">—</button>
                  </div>
                </div>

                {/* Pillar description */}
                {(p.description ?? "").trim().length > 0 && (
                  <div className="px-11 pb-3 text-[13px] text-slate-600">
                    {p.description}
                  </div>
                )}

                {/* Themes */}
                {isOpen &&
                  pillarThemes.map((t) => {
                    const themeOpen = openThemes[t.code] ?? defaultOpen;
                    const subRows = (subsByTheme[t.code] ?? []).slice()
                      .sort((a, b) => sortNum((a as any).sort_order) - sortNum((b as any).sort_order));

                    return (
                      <div key={t.code} className="bg-slate-50">
                        <div className="grid grid-cols-[1fr,120px,120px] items-center px-4 py-3">
                          <div className="flex items-start gap-2 pl-8">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenThemes((s) => ({ ...s, [t.code]: !themeOpen }))
                              }
                              className="mt-1 h-5 w-5 flex items-center justify-center rounded hover:bg-slate-100"
                              aria-label={themeOpen ? "Collapse theme" : "Expand theme"}
                            >
                              <span className="text-slate-500">{themeOpen ? "▾" : "▸"}</span>
                            </button>

                            <span className="inline-flex items-center gap-2">
                              <span className="rounded bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 border border-green-100">
                                Theme
                              </span>
                              <span className="text-xs font-medium text-slate-400">{t.code}</span>
                              <span className="text-sm font-medium text-slate-900">{t.name}</span>
                            </span>
                          </div>

                          <div className="text-right pr-4 text-sm text-slate-700">
                            {sortNum((t as any).sort_order)}
                          </div>

                          <div className="text-right pr-2">
                            <button className="text-slate-400 cursor-default">—</button>
                          </div>
                        </div>

                        {(t.description ?? "").trim().length > 0 && (
                          <div className="px-14 pb-3 text-[13px] text-slate-600">
                            {t.description}
                          </div>
                        )}

                        {/* Subthemes */}
                        {themeOpen &&
                          subRows.map((s) => (
                            <div
                              key={s.code}
                              className="grid grid-cols-[1fr,120px,120px] items-center px-4 py-3 bg-white"
                            >
                              <div className="flex items-start gap-2 pl-16">
                                <span className="rounded bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 border border-red-100">
                                  Subtheme
                                </span>
                                <span className="text-xs font-medium text-slate-400">{s.code}</span>
                                <span className="text-sm font-medium text-slate-900">{s.name}</span>
                              </div>

                              <div className="text-right pr-4 text-sm text-slate-700">
                                {sortNum((s as any).sort_order)}
                              </div>

                              <div className="text-right pr-2">
                                <button className="text-slate-400 cursor-default">—</button>
                              </div>

                              {(s.description ?? "").trim().length > 0 && (
                                <div className="col-span-3 pl-20 pr-6 pb-3 text-[13px] text-slate-600">
                                  {s.description}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
