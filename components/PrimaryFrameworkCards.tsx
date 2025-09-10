"use client";

// Robust, schema-tolerant PrimaryFrameworkCards
// - Works whether themes/subthemes link by *_id (uuid) or *_code (text)
// - Keeps your current look-and-feel and caret toggling
// - No DB calls here; pure UI

import { useMemo, useState } from "react";

// Accept both old and new shapes (id is optional to avoid build loops)
export type Pillar = {
  id?: string;            // uuid (new) — optional for tolerance
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Theme = {
  id?: string;            // uuid (new)
  code: string;
  pillar_id?: string | null;
  pillar_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Subtheme = {
  id?: string;            // uuid (new)
  code: string;
  theme_id?: string | null;
  theme_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Actions = {
  // placeholders for future edit actions; keep optional to avoid type loops
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
  actions?: Actions;
};

const bySort = <T extends { sort_order?: number | null }>(a: T, b: T) =>
  (a.sort_order ?? 0) - (b.sort_order ?? 0);

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
}: Props) {
  // UI state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (key: string) =>
    setOpenPillars((s) => ({ ...s, [key]: !(s[key] ?? defaultOpen) }));
  const toggleTheme = (key: string) =>
    setOpenThemes((s) => ({ ...s, [key]: !(s[key] ?? defaultOpen) }));

  // Group themes by pillar_id OR pillar_code (supports either schema)
  const themesByPillarId = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      const k = (t as any).pillar_id ?? (t as any).pillarId ?? "";
      if (!k) continue;
      (m[k] ??= []).push(t);
    }
    // keep child sort stable
    Object.values(m).forEach((arr) => arr.sort(bySort));
    return m;
  }, [themes]);

  const themesByPillarCode = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      const k = (t as any).pillar_code ?? (t as any).pillarCode ?? "";
      if (!k) continue;
      (m[k] ??= []).push(t);
    }
    Object.values(m).forEach((arr) => arr.sort(bySort));
    return m;
  }, [themes]);

  // Group subthemes by theme_id OR theme_code
  const subthemesByThemeId = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const k = (s as any).theme_id ?? (s as any).themeId ?? "";
      if (!k) continue;
      (m[k] ??= []).push(s);
    }
    Object.values(m).forEach((arr) => arr.sort(bySort));
    return m;
  }, [subthemes]);

  const subthemesByThemeCode = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const k = (s as any).theme_code ?? (s as any).themeCode ?? "";
      if (!k) continue;
      (m[k] ??= []).push(s);
    }
    Object.values(m).forEach((arr) => arr.sort(bySort));
    return m;
  }, [subthemes]);

  // ---------- UI ----------
  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name &amp; Description</div>
        <div className="text-center">Sort</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {/* Pillars */}
      <div>
        {(pillars ?? [])
          .slice()
          .sort(bySort)
          .map((p) => {
            const pOpen = openPillars[p.code] ?? defaultOpen;

            // Pull themes by id first; if missing, fall back to code
            const childrenThemes =
              (p.id && themesByPillarId[p.id]) ||
              themesByPillarCode[p.code] ||
              [];

            return (
              <div key={p.code} className="border-b border-gray-100">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => togglePillar(p.code)}
                      aria-label={pOpen ? "Collapse pillar" : "Expand pillar"}
                      className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
                    >
                      <span
                        className={`inline-block transition-transform ${
                          pOpen ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Pillar
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          {p.code}
                        </span>
                        <span className="truncate font-medium text-gray-900">
                          {p.name}
                        </span>
                      </div>
                      {p.description ? (
                        <div className="mt-1 text-sm text-gray-600">
                          {p.description}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-700">
                    {p.sort_order ?? 0}
                  </div>

                  <div className="text-right text-sm text-gray-400 pr-2">
                    {/* action icons placeholder */}
                    •••
                  </div>
                </div>

                {/* Themes under pillar */}
                {pOpen &&
                  childrenThemes.map((t) => {
                    const tKey = t.code; // stable UI key
                    const tOpen = openThemes[tKey] ?? defaultOpen;

                    // Subthemes: prefer theme_id; fall back to theme_code
                    const childrenSubs =
                      (t.id && subthemesByThemeId[t.id]) ||
                      subthemesByThemeCode[t.code] ||
                      [];

                    return (
                      <div key={tKey} className="bg-gray-50/50">
                        {/* Theme row */}
                        <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                          <div className="ml-8 flex items-start gap-3">
                            <button
                              onClick={() => toggleTheme(tKey)}
                              aria-label={
                                tOpen ? "Collapse theme" : "Expand theme"
                              }
                              className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
                            >
                              <span
                                className={`inline-block transition-transform ${
                                  tOpen ? "rotate-90" : ""
                                }`}
                              >
                                ▶
                              </span>
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                  Theme
                                </span>
                                <span className="text-xs font-semibold text-gray-400">
                                  {t.code}
                                </span>
                                <span className="truncate font-medium text-gray-900">
                                  {t.name}
                                </span>
                              </div>
                              {t.description ? (
                                <div className="mt-1 text-sm text-gray-600">
                                  {t.description}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-center text-sm text-gray-700">
                            {t.sort_order ?? 0}
                          </div>

                          <div className="text-right text-sm text-gray-400 pr-2">
                            •••
                          </div>
                        </div>

                        {/* Subthemes under theme */}
                        {tOpen &&
                          childrenSubs.map((s) => (
                            <div
                              key={s.code}
                              className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3"
                            >
                              <div className="ml-16 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                    Subtheme
                                  </span>
                                  <span className="text-xs font-semibold text-gray-400">
                                    {s.code}
                                  </span>
                                  <span className="truncate font-medium text-gray-900">
                                    {s.name}
                                  </span>
                                </div>
                                {s.description ? (
                                  <div className="mt-1 text-sm text-gray-600">
                                    {s.description}
                                  </div>
                                ) : null}
                              </div>

                              <div className="text-center text-sm text-gray-700">
                                {s.sort_order ?? 0}
                              </div>

                              <div className="text-right text-sm text-gray-400 pr-2">
                                •••
                              </div>
                            </div>
                          ))}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </section>
  );
}
