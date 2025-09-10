// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Entity = "pillar" | "theme" | "subtheme";
type Actions = {
  updateName?: (entity: Entity, code: string, name: string) => Promise<void> | void;
  updateDescription?: (entity: Entity, code: string, description: string) => Promise<void> | void;
  updateSort?: (entity: Entity, code: string, sort: number) => Promise<void> | void;
  bumpSort?: (entity: Entity, code: string, delta: number) => Promise<void> | void;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions;
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const safeActions: Required<Actions> = {
    updateName: async () => {},
    updateDescription: async () => {},
    updateSort: async () => {},
    bumpSort: async () => {},
    ...(actions ?? {}),
  };

// Group themes under their parent pillar
const themesByPillar: Record<string, Theme[]> = useMemo(() => {
  const m: Record<string, Theme[]> = {};
  for (const t of themes) {
    const key = t.pillar_code ?? ""; // <-- Theme has pillar_code
    if (!m[key]) m[key] = [];
    m[key].push(t);
  }
  return m;
}, [themes]);

 // Group subthemes under their parent theme
const subthemesByTheme: Record<string, Subtheme[]> = useMemo(() => {
  const m: Record<string, Subtheme[]> = {};
  for (const s of subthemes) {
    const key = s.theme_code ?? ""; // <-- Subtheme has theme_code
    if (!m[key]) m[key] = [];
    m[key].push(s);
  }
  return m;
}, [subthemes]);

  // collapsed/expanded state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(pillars.map((p) => [p.code, !!defaultOpen]))
  );
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (code: string) =>
    setOpenPillars((prev) => ({ ...prev, [code]: !prev[code] }));
  const toggleTheme = (code: string) =>
    setOpenThemes((prev) => ({ ...prev, [code]: !prev[code] }));

  return (
    <div className="mt-6 overflow-hidden rounded-xl border">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_120px_160px] items-center bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
        <div>Name / Description</div>
        <div className="text-center">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y">
        {pillars
          ?.slice()
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((p) => {
            const isOpen = openPillars[p.code] ?? defaultOpen;

            return (
              <div key={p.code}>
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr_120px_160px] items-center px-4 py-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => togglePillar(p.code)}
                      aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                      className="mt-1 shrink-0 rounded p-1 hover:bg-gray-100"
                    >
                      <span className="inline-block rotate-0 transition-transform" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                        ▶
                      </span>
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Pillar
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{p.code}</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{p.name}</span>
                      </div>
                      {p.description ? (
                        <div className="mt-1 text-[13px] text-gray-700">{p.description}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-600">{p.sort ?? 0}</div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => safeActions.bumpSort("pillar", p.code, -1)}
                    >
                      ↑
                    </button>
                    <button
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => safeActions.bumpSort("pillar", p.code, +1)}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {/* Themes under this pillar */}
                {isOpen && (
                  <div className="divide-y">
                    {(themesByPillar[p.code] ?? [])
                      .slice()
                      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
                      .map((t) => {
                        const tOpen = openThemes[t.code] ?? false;
                        return (
                          <div key={t.code} className="bg-white">
                            {/* Theme row */}
                            <div className="grid grid-cols-[1fr_120px_160px] items-center px-4 py-3">
                              <div className="ml-6 flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleTheme(t.code)}
                                  aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                                  className="mt-1 shrink-0 rounded p-1 hover:bg-gray-100"
                                >
                                  <span className="inline-block rotate-0 transition-transform" style={{ transform: tOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                                    ▶
                                  </span>
                                </button>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                      Theme
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400">{t.code}</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">{t.name}</span>
                                  </div>
                                  {t.description ? (
                                    <div className="mt-1 text-[13px] text-gray-700">{t.description}</div>
                                  ) : null}
                                </div>
                              </div>

                              <div className="text-center text-sm text-gray-600">{t.sort ?? 0}</div>

                              <div className="flex justify-end gap-2">
                                <button
                                  className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                  onClick={() => safeActions.bumpSort("theme", t.code, -1)}
                                >
                                  ↑
                                </button>
                                <button
                                  className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                  onClick={() => safeActions.bumpSort("theme", t.code, +1)}
                                >
                                  ↓
                                </button>
                              </div>
                            </div>

                            {/* Subthemes under this theme */}
                            {tOpen && (
                              <div className="divide-y">
                                {(subthemesByTheme[t.code] ?? [])
                                  .slice()
                                  .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
                                  .map((s) => (
                                    <div
                                      key={s.code}
                                      className="grid grid-cols-[1fr_120px_160px] items-center bg-white px-4 py-3"
                                    >
                                      <div className="ml-12">
                                        <div className="flex items-center gap-2">
                                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                            Subtheme
                                          </span>
                                          <span className="text-xs font-semibold text-gray-400">{s.code}</span>
                                          <span className="ml-2 text-sm font-medium text-gray-900">{s.name}</span>
                                        </div>
                                        {s.description ? (
                                          <div className="mt-1 text-[13px] text-gray-700">{s.description}</div>
                                        ) : null}
                                      </div>

                                      <div className="text-center text-sm text-gray-600">{s.sort ?? 0}</div>

                                      <div className="flex justify-end gap-2">
                                        <button
                                          className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                          onClick={() => safeActions.bumpSort("subtheme", s.code, -1)}
                                        >
                                          ↑
                                        </button>
                                        <button
                                          className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                          onClick={() => safeActions.bumpSort("subtheme", s.code, +1)}
                                        >
                                          ↓
                                        </button>
                                      </div>
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
    </div>
  );
}
