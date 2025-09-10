// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Edit, Trash2, Plus } from "lucide-react";
import { HierTag } from "@/lib/ui";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
  actions,
}: {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  defaultOpen?: boolean;
  actions?: {
    onAddPillar?: () => void;
    onEditPillar?: (p: Pillar) => void;
    onDeletePillar?: (p: Pillar) => void;

    onAddTheme?: (pillar: Pillar) => void;
    onEditTheme?: (t: Theme) => void;
    onDeleteTheme?: (t: Theme) => void;

    onAddSubtheme?: (theme: Theme) => void;
    onEditSubtheme?: (s: Subtheme) => void;
    onDeleteSubtheme?: (s: Subtheme) => void;
  };
}) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const pillarsSorted = useMemo(
    () => [...(pillars ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [pillars]
  );

  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_id ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_id ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    return map;
  }, [subthemes]);

  // Initialize defaults
  useMemo(() => {
    if (!defaultOpen) return;
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    pillarsSorted.forEach((x) => (p[x.id] = true));
    (themes ?? []).forEach((x) => (t[x.id] = true));
    setOpenPillars(p);
    setOpenThemes(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-center">Hierarchy</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {/* Content */}
      <div className="divide-y">
        {pillarsSorted.map((p) => {
          const isPillarOpen = openPillars[p.id] ?? defaultOpen;
          const pillarThemes = themesByPillar[p.id] ?? [];

          return (
            <div key={p.id} className="px-4 py-3">
              {/* Pillar row */}
              <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2">
                {/* Left: caret + name + description */}
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-left"
                    onClick={() => setOpenPillars((m) => ({ ...m, [p.id]: !isPillarOpen }))}
                    title={isPillarOpen ? "Collapse Pillar" : "Expand Pillar"}
                    aria-expanded={isPillarOpen}
                  >
                    <span className="inline-flex items-center">
                      {isPillarOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </button>
                  {/* Description directly under the name, aligned with name’s left edge */}
                  {p.description && (
                    <p className="ml-6 mt-1 text-sm text-gray-600">{p.description}</p>
                  )}
                </div>

                {/* Middle: Tag */}
                <div className="mt-1 text-center">
                  <HierTag level="pillar" />
                </div>

                {/* Right: actions */}
                <div className="mt-1 flex items-center justify-end gap-2 pr-2">
                  {canAct && (
                    <>
                      <button
                        type="button"
                        onClick={() => actions?.onAddTheme?.(p)}
                        title="Add Theme"
                        className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => actions?.onEditPillar?.(p)}
                        title="Edit Pillar"
                        className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => actions?.onDeletePillar?.(p)}
                        title="Delete Pillar"
                        className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Themes */}
              {isPillarOpen && pillarThemes.length > 0 && (
                <div className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                  {pillarThemes.map((t) => {
                    const isThemeOpen = openThemes[t.id] ?? defaultOpen;
                    const themeSubs = subthemesByTheme[t.id] ?? [];
                    return (
                      <div key={t.id}>
                        {/* Theme row */}
                        <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2">
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-left"
                              onClick={() => setOpenThemes((m) => ({ ...m, [t.id]: !isThemeOpen }))}
                              title={isThemeOpen ? "Collapse Theme" : "Expand Theme"}
                              aria-expanded={isThemeOpen}
                            >
                              <span className="inline-flex items-center">
                                {isThemeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </span>
                              <span className="font-medium text-gray-900">{t.name}</span>
                            </button>
                            {t.description && (
                              <p className="ml-6 mt-1 text-sm text-gray-600">{t.description}</p>
                            )}
                          </div>

                          <div className="mt-1 text-center">
                            <HierTag level="theme" />
                          </div>

                          <div className="mt-1 flex items-center justify-end gap-2 pr-2">
                            {canAct && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => actions?.onAddSubtheme?.(t)}
                                  title="Add Subtheme"
                                  className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                                >
                                  <Plus size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => actions?.onEditTheme?.(t)}
                                  title="Edit Theme"
                                  className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => actions?.onDeleteTheme?.(t)}
                                  title="Delete Theme"
                                  className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Subthemes */}
                        {isThemeOpen && themeSubs.length > 0 && (
                          <div className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                            {themeSubs.map((s) => (
                              <div key={s.id} className="grid grid-cols-[1fr,120px,120px] items-start gap-2">
                                <div className="">
                                  <div className="ml-6">
                                    <span className="font-medium text-gray-900">{s.name}</span>
                                    {s.description && (
                                      <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-1 text-center">
                                  <HierTag level="subtheme" />
                                </div>
                                <div className="mt-1 flex items-center justify-end gap-2 pr-2">
                                  {canAct && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => actions?.onEditSubtheme?.(s)}
                                        title="Edit Subtheme"
                                        className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => actions?.onDeleteSubtheme?.(s)}
                                        title="Delete Subtheme"
                                        className="rounded-md border p-1.5 text-gray-700 hover:bg-gray-50"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </>
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
