"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Theme = {
  id: string;
  code: string;
  pillar_code: string;
  pillar_id?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Subtheme = {
  id: string;
  code: string;
  theme_code: string;
  theme_id?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Actions = {
  updateName?: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void>;
  updateDescription?: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void>;
  updateSort?: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void>;
  bumpSort?: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions; // optional for read-only screens
};

// Simple icon buttons (no external libs)
function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      {children}
    </button>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}
      aria-hidden
    >
      ▶
    </span>
  );
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // Open state maps
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Group themes by pillar_code (snake_case to match DB)
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    return m;
  }, [themes]);

  // Group subthemes by theme_code
  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    return m;
  }, [subthemes]);

  const togglePillar = (code: string) =>
    setOpenPillars((prev) => ({ ...prev, [code]: !(prev[code] ?? defaultOpen) }));
  const toggleTheme = (code: string) =>
    setOpenThemes((prev) => ({ ...prev, [code]: !(prev[code] ?? defaultOpen) }));

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-right">Sort order</div>
        <div className="text-right pr-1">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((p) => {
            const pillarOpen = openPillars[p.code] ?? defaultOpen;
            const theseThemes = (themesByPillar[p.code] ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

            return (
              <div key={p.code} className="bg-white">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                  {/* Left: caret + tag + code + name + description */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => togglePillar(p.code)}
                      className="mt-1 text-gray-500 hover:text-gray-800"
                      aria-label={pillarOpen ? "Collapse pillar" : "Expand pillar"}
                    >
                      <Caret open={pillarOpen} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                          Pillar
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{p.code}</span>
                        <span className="truncate text-sm font-medium text-gray-900">{p.name}</span>
                      </div>
                      {p.description ? (
                        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-gray-600">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="text-right text-sm text-gray-600 tabular-nums">
                    {p.sort_order ?? 0}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    {canAct ? (
                      <>
                        <IconButton title="Move up" onClick={() => actions?.bumpSort?.("pillar", p.code, -1)}>
                          ↑
                        </IconButton>
                        <IconButton title="Move down" onClick={() => actions?.bumpSort?.("pillar", p.code, +1)}>
                          ↓
                        </IconButton>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>

                {/* Themes list (only if open) */}
                {pillarOpen && theseThemes.length > 0 && (
                  <div className="bg-gray-50/40">
                    {theseThemes.map((t) => {
                      const themeOpen = openThemes[t.code] ?? defaultOpen;
                      const theseSubs = (subsByTheme[t.code] ?? [])
                        .slice()
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

                      return (
                        <div key={t.code} className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                          {/* Left cell */}
                          <div className="flex items-start gap-3 pl-6">
                            <button
                              type="button"
                              onClick={() => toggleTheme(t.code)}
                              className="mt-1 text-gray-500 hover:text-gray-800"
                              aria-label={themeOpen ? "Collapse theme" : "Expand theme"}
                            >
                              <Caret open={themeOpen} />
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                                  Theme
                                </span>
                                <span className="text-xs font-semibold text-gray-400">{t.code}</span>
                                <span className="truncate text-sm font-medium text-gray-900">{t.name}</span>
                              </div>
                              {t.description ? (
                                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-gray-600">
                                  {t.description}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          {/* Sort */}
                          <div className="text-right text-sm text-gray-600 tabular-nums">
                            {t.sort_order ?? 0}
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-2">
                            {canAct ? (
                              <>
                                <IconButton title="Move up" onClick={() => actions?.bumpSort?.("theme", t.code, -1)}>
                                  ↑
                                </IconButton>
                                <IconButton title="Move down" onClick={() => actions?.bumpSort?.("theme", t.code, +1)}>
                                  ↓
                                </IconButton>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>

                          {/* Subthemes (full-width under this theme) */}
                          {themeOpen && theseSubs.length > 0 && (
                            <div className="col-span-3">
                              {theseSubs.map((s) => (
                                <div key={s.code} className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-2">
                                  <div className="flex items-start gap-3 pl-12">
                                    <span className="mt-1 h-4 w-4 text-[10px] leading-4 text-gray-400">•</span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
                                          Subtheme
                                        </span>
                                        <span className="text-xs font-semibold text-gray-400">{s.code}</span>
                                        <span className="truncate text-sm font-medium text-gray-900">{s.name}</span>
                                      </div>
                                      {s.description ? (
                                        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-gray-600">
                                          {s.description}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>

                                  <div className="text-right text-sm text-gray-600 tabular-nums">
                                    {s.sort_order ?? 0}
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    {canAct ? (
                                      <>
                                        <IconButton title="Move up" onClick={() => actions?.bumpSort?.("subtheme", s.code, -1)}>
                                          ↑
                                        </IconButton>
                                        <IconButton title="Move down" onClick={() => actions?.bumpSort?.("subtheme", s.code, +1)}>
                                          ↓
                                        </IconButton>
                                      </>
                                    ) : (
                                      <span className="text-xs text-gray-400">—</span>
                                    )}
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
    </section>
  );
}
