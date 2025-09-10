"use client";

// components/PrimaryFrameworkCards.tsx
import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

type ActionHandlers = {
  updateName?: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void> | void;
  updateDescription?: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void> | void;
  updateSort?: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void> | void;
  bumpSort?: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void> | void;
  remove?: (entity: "pillar" | "theme" | "subtheme", code: string) => Promise<void> | void;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: ActionHandlers; // optional; safe for read-only builds
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // local open state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // group themes by pillar_code (snake_case to match DB)
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = (t as any)?.pillar_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    return m;
  }, [themes]);

  // group subthemes by theme_code (snake_case to match DB)
  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = (s as any)?.theme_code ?? "";
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
        <div className="text-center">Sort</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => ((a as any)?.sort_order ?? 0) - ((b as any)?.sort_order ?? 0))
          .map((p) => {
            const pIsOpen = openPillars[p.code] ?? defaultOpen;
            const pThemes = (themesByPillar[p.code] ?? []).slice().sort(
              (a, b) => ((a as any)?.sort_order ?? 0) - ((b as any)?.sort_order ?? 0)
            );

            return (
              <div key={`pillar-${p.code}`} className="bg-white">
                {/* PILLAR ROW */}
                <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-label={pIsOpen ? "Collapse pillar" : "Expand pillar"}
                      onClick={() => togglePillar(p.code)}
                      className="mt-1 rounded p-1 hover:bg-gray-100"
                    >
                      {pIsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    <div className="min-w-0">
                      {/* Tag + Code + Name */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Pillar
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{p.code}</span>
                        <span className="truncate text-sm font-medium text-gray-900">{p.name}</span>
                      </div>
                      {/* Description */}
                      {p.description ? (
                        <p className="mt-1 text-sm text-gray-600">{p.description}</p>
                      ) : null}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="text-center text-sm text-gray-700">
                    {(p as any)?.sort_order ?? 0}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={!canAct}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
                      title="Edit"
                      onClick={() => actions?.updateName?.("pillar", p.code, p.name)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={!canAct}
                      className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      title="Delete"
                      onClick={() => actions?.remove?.("pillar", p.code)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* THEMES for this pillar */}
                {pIsOpen &&
                  pThemes.map((t) => {
                    const tIsOpen = openThemes[t.code] ?? defaultOpen;
                    const tSubs = (subthemesByTheme[t.code] ?? []).slice().sort(
                      (a, b) => ((a as any)?.sort_order ?? 0) - ((b as any)?.sort_order ?? 0)
                    );

                    return (
                      <div key={`theme-${t.code}`} className="bg-white">
                        {/* THEME ROW */}
                        <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                          <div className="ml-8 flex items-start gap-3">
                            <button
                              type="button"
                              aria-label={tIsOpen ? "Collapse theme" : "Expand theme"}
                              onClick={() => toggleTheme(t.code)}
                              className="mt-1 rounded p-1 hover:bg-gray-100"
                            >
                              {tIsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Theme
                                </span>
                                <span className="text-xs font-semibold text-gray-400">{t.code}</span>
                                <span className="truncate text-sm font-medium text-gray-900">
                                  {t.name}
                                </span>
                              </div>
                              {t.description ? (
                                <p className="mt-1 text-sm text-gray-600">{t.description}</p>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-center text-sm text-gray-700">
                            {(t as any)?.sort_order ?? 0}
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={!canAct}
                              className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
                              title="Edit"
                              onClick={() => actions?.updateName?.("theme", t.code, t.name)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={!canAct}
                              className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                              title="Delete"
                              onClick={() => actions?.remove?.("theme", t.code)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* SUBTHEMES for this theme */}
                        {tIsOpen &&
                          tSubs.map((s) => (
                            <div
                              key={`subtheme-${s.code}`}
                              className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3"
                            >
                              <div className="ml-16 flex items-start gap-3">
                                {/* spacer keeps alignment with carats above */}
                                <div className="h-5 w-5" />
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                      Subtheme
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400">
                                      {s.code}
                                    </span>
                                    <span className="truncate text-sm font-medium text-gray-900">
                                      {s.name}
                                    </span>
                                  </div>
                                  {s.description ? (
                                    <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                                  ) : null}
                                </div>
                              </div>

                              <div className="text-center text-sm text-gray-700">
                                {(s as any)?.sort_order ?? 0}
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  disabled={!canAct}
                                  className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
                                  title="Edit"
                                  onClick={() => actions?.updateName?.("subtheme", s.code, s.name)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  disabled={!canAct}
                                  className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                  title="Delete"
                                  onClick={() => actions?.remove?.("subtheme", s.code)}
                                >
                                  <Trash2 size={16} />
                                </button>
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
