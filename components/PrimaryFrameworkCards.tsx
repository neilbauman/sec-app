// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  /** if true, expand all pillars & themes initially */
  defaultOpen?: boolean;
};

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
}: Props) {
  // map themes by pillar, and subthemes by theme
  const { themesByPillar, subthemesByTheme } = useMemo(() => {
    const tByP: Record<string, Theme[]> = {};
    const sByT: Record<string, Subtheme[]> = {};

    for (const t of themes) {
      if (!tByP[t.pillar_code]) tByP[t.pillar_code] = [];
      tByP[t.pillar_code].push(t);
    }
    for (const s of subthemes) {
      if (!sByT[s.theme_code]) sByT[s.theme_code] = [];
      sByT[s.theme_code].push(s);
    }
    // keep lists stable & sorted by code
    for (const k of Object.keys(tByP)) {
      tByP[k].sort((a, b) => a.code.localeCompare(b.code));
    }
    for (const k of Object.keys(sByT)) {
      sByT[k].sort((a, b) => a.code.localeCompare(b.code));
    }
    return { themesByPillar: tByP, subthemesByTheme: sByT };
  }, [themes, subthemes]);

  // expansion state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(
    () =>
      pillars.reduce((acc, p) => {
        acc[p.code] = !!defaultOpen;
        return acc;
      }, {} as Record<string, boolean>)
  );
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>(
    () =>
      themes.reduce((acc, t) => {
        acc[t.code] = !!defaultOpen;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !s[code] }));
  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !s[code] }));

  return (
    <div className="space-y-4">
      {pillars.map((p) => {
        const pOpen = openPillars[p.code] ?? false;
        const pThemes = themesByPillar[p.code] ?? [];

        return (
          <div key={p.code} className="rounded-xl border bg-white">
            {/* Pillar header */}
            <button
              type="button"
              onClick={() => togglePillar(p.code)}
              className="w-full flex items-start justify-between gap-4 p-4"
            >
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5">
                    Pillar
                  </span>
                  <span className="font-semibold">{p.code}</span>
                </div>
                <div className="text-sm text-slate-700">{p.name}</div>
                {p.description ? (
                  <div className="text-xs text-slate-500">{p.description}</div>
                ) : null}
              </div>
              <div className="shrink-0 text-slate-400">{pOpen ? "▾" : "▸"}</div>
            </button>

            {/* Themes */}
            {pOpen && pThemes.length > 0 && (
              <div className="divide-y">
                {pThemes.map((t) => {
                  const tOpen = openThemes[t.code] ?? false;
                  const tSubs = subthemesByTheme[t.code] ?? [];
                  return (
                    <div key={t.code} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleTheme(t.code)}
                        className="w-full flex items-start justify-between gap-4"
                      >
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5">
                              Theme
                            </span>
                            <span className="font-medium">{t.code}</span>
                          </div>
                          <div className="text-sm text-slate-700">{t.name}</div>
                          {t.description ? (
                            <div className="text-xs text-slate-500">
                              {t.description}
                            </div>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-slate-400">
                          {tOpen ? "▾" : "▸"}
                        </div>
                      </button>

                      {/* Subthemes */}
                      {tOpen && tSubs.length > 0 && (
                        <div className="mt-3 space-y-2 pl-6">
                          {tSubs.map((s) => (
                            <div
                              key={s.code}
                              className="rounded-lg border bg-slate-50 p-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5">
                                  Subtheme
                                </span>
                                <span className="text-sm font-medium">
                                  {s.code}
                                </span>
                              </div>
                              <div className="text-sm text-slate-700">
                                {s.name}
                              </div>
                              {s.description ? (
                                <div className="text-xs text-slate-500">
                                  {s.description}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
