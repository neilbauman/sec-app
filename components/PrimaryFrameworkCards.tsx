"use client";

// Self-contained, no exported types to avoid cross-file type drift.
import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

type Pillar = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_code?: string | null;   // snake_case to match DB
  parent_code?: string | null;   // legacy safety
};

type Subtheme = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  theme_code?: string | null;    // snake_case to match DB
  parent_code?: string | null;   // legacy safety
};

type Actions = {
  updateName?: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void> | void;
  updateDescription?: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void> | void;
  updateSort?: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void> | void;
  bumpSort?: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void> | void;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions; // optional; page can pass {} while we’re read-only
};

function badge(color: "blue" | "green" | "red", text: string) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-1 ring-green-200",
    red: "bg-red-50 text-red-700 ring-1 ring-red-200",
  }[color];
  return `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${colors}`;
}

function caret(open: boolean) {
  return open ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />;
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Index themes by pillar
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_code ?? t.parent_code ?? "";
      if (!key) continue;
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return m;
  }, [themes]);

  // Index subthemes by theme
  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_code ?? s.parent_code ?? "";
      if (!key) continue;
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return m;
  }, [subthemes]);

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name &amp; Description</div>
        <div className="text-center">Sort order</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((p) => {
            const isOpen = openPillars[p.code] ?? defaultOpen;
            const pillarThemes = themesByPillar[p.code] ?? [];

            return (
              <div key={p.code} className="bg-white">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <button
                      aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                      onClick={() => setOpenPillars((s) => ({ ...s, [p.code]: !isOpen }))}
                      className="mt-0.5 rounded p-1 hover:bg-gray-100"
                    >
                      {caret(isOpen)}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={badge("blue", "Pillar")} />
                        <span className="text-[11px] font-semibold text-gray-400">{p.code}</span>
                        <span className="truncate font-medium text-gray-900">{p.name}</span>
                      </div>
                      {/* name over description (indented), per your spec */}
                      <div className="pl-[84px] text-sm text-gray-600">{p.description}</div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500">{p.sort_order ?? 0}</div>

                  <div className="flex items-center justify-center gap-2">
                    <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Themes under this pillar */}
                {isOpen && pillarThemes.length > 0 && (
                  <div className="bg-gray-50/40">
                    {pillarThemes.map((t) => {
                      const tOpen = openThemes[t.code] ?? defaultOpen;
                      const tSubs = subsByTheme[t.code] ?? [];
                      return (
                        <div key={t.code} className="border-t border-gray-100">
                          {/* Theme row */}
                          <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                            <div className="ml-6 flex items-start gap-2">
                              <button
                                aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                                onClick={() => setOpenThemes((s) => ({ ...s, [t.code]: !tOpen }))}
                                className="mt-0.5 rounded p-1 hover:bg-gray-100"
                              >
                                {caret(tOpen)}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={badge("green", "Theme")} />
                                  <span className="text-[11px] font-semibold text-gray-400">{t.code}</span>
                                  <span className="truncate font-medium text-gray-900">{t.name}</span>
                                </div>
                                <div className="pl-[84px] text-sm text-gray-600">{t.description}</div>
                              </div>
                            </div>

                            <div className="text-center text-sm text-gray-500">{t.sort_order ?? 0}</div>

                            <div className="flex items-center justify-center gap-2">
                              <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Edit">
                                <Pencil size={16} />
                              </button>
                              <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Subthemes under this theme */}
                          {tOpen && tSubs.length > 0 && (
                            <div className="bg-white">
                              {tSubs.map((s) => (
                                <div key={s.code} className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                                  <div className="ml-14 flex items-start gap-2">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={badge("red", "Subtheme")} />
                                        <span className="text-[11px] font-semibold text-gray-400">{s.code}</span>
                                        <span className="truncate font-medium text-gray-900">{s.name}</span>
                                      </div>
                                      <div className="pl-[84px] text-sm text-gray-600">{s.description}</div>
                                    </div>
                                  </div>

                                  <div className="text-center text-sm text-gray-500">{s.sort_order ?? 0}</div>

                                  <div className="flex items-center justify-center gap-2">
                                    <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Edit">
                                      <Pencil size={16} />
                                    </button>
                                    <button className="rounded p-1.5 hover:bg-gray-100" disabled={!canAct} title="Delete">
                                      <Trash2 size={16} />
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
    </section>
  );
}
