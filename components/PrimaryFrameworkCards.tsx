// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ActionIcon from "@/components/ActionIcon";

export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string | null;
  pillar_code?: string | null;
};

export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string | null;
  theme_code?: string | null;
};

type Actions = {
  // placeholders; wire up later
  onCreatePillar?: () => void;
  onEditPillar?: (p: Pillar) => void;
  onDeletePillar?: (p: Pillar) => void;

  onCreateTheme?: (pillar: Pillar) => void;
  onEditTheme?: (t: Theme) => void;
  onDeleteTheme?: (t: Theme) => void;

  onCreateSubtheme?: (theme: Theme) => void;
  onEditSubtheme?: (s: Subtheme) => void;
  onDeleteSubtheme?: (s: Subtheme) => void;
};

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  actions = {},
  defaultOpen = false,
}: {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions;
  defaultOpen?: boolean;
}) {
  // group themes by pillar and subthemes by theme
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      const key = t.pillar_id ?? t.pillar_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    // sort themes by sort_order asc
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.sort_order - b.sort_order));
    return map;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const key = s.theme_id ?? s.theme_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    // sort subthemes by sort_order asc
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.sort_order - b.sort_order));
    return map;
  }, [subthemes]);

  // expand/collapse state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (idOrCode: string) =>
    setOpenPillars((s) => ({ ...s, [idOrCode]: !(s[idOrCode] ?? defaultOpen) }));

  const toggleTheme = (idOrCode: string) =>
    setOpenThemes((s) => ({ ...s, [idOrCode]: !(s[idOrCode] ?? defaultOpen) }));

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-center">Code</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Pillars */}
      <ul className="divide-y divide-gray-200">
        {pillars
          ?.slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => {
            const pid = p.id || p.code;
            const pillarThemes =
              themesByPillar[p.id] || themesByPillar[p.code] || [];

            const isOpen = openPillars[pid] ?? defaultOpen;

            return (
              <li key={pid} className="px-2 py-2">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-2 py-2">
                  {/* caret + tag + name + description */}
                  <div>
                    <div className="flex items-start gap-2">
                      {/* caret + tag block (unchanged sizing) */}
                      <button
                        type="button"
                        onClick={() => togglePillar(pid)}
                        className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-50"
                        aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                      >
                        {/* ▼ / ▶ using css rotate for the same size */}
                        <span
                          className={`inline-block transition-transform ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                      </button>

                      <span className="mt-1 inline-flex select-none items-center rounded border border-gray-200 bg-gray-50 px-2 text-xs font-medium text-gray-700">
                        Pillar
                      </span>

                      <div className="min-w-0">
                        {/* Name */}
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {p.name || p.code}
                        </div>
                        {/* Description aligned directly under name */}
                        {p.description && (
                          <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="self-center text-center text-sm text-gray-700">
                    {p.code}
                  </div>

                  {/* Actions (icons + tooltips) */}
                  <div className="flex items-center justify-center gap-2">
                    <ActionIcon title="Add Theme (coming soon)" disabled>
                      <Plus className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon title="Edit Pillar (coming soon)" disabled>
                      <Pencil className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon title="Delete Pillar (coming soon)" disabled>
                      <Trash2 className="h-4 w-4" />
                    </ActionIcon>
                  </div>
                </div>

                {/* Themes (collapsible) */}
                {isOpen && pillarThemes.length > 0 && (
                  <div className="ml-7 mt-2 border-l border-gray-200 pl-3">
                    <ul className="space-y-2">
                      {pillarThemes.map((t) => {
                        const tid = t.id || t.code;
                        const isThemeOpen = openThemes[tid] ?? defaultOpen;
                        const tSubs =
                          subsByTheme[t.id] || subsByTheme[t.code] || [];

                        return (
                          <li key={tid} className="rounded-md border border-gray-100 p-2">
                            <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2">
                              <div>
                                <div className="flex items-start gap-2">
                                  {/* caret + tag */}
                                  <button
                                    type="button"
                                    onClick={() => toggleTheme(tid)}
                                    className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-50"
                                    aria-label={isThemeOpen ? "Collapse theme" : "Expand theme"}
                                  >
                                    <span
                                      className={`inline-block transition-transform ${
                                        isThemeOpen ? "rotate-90" : ""
                                      }`}
                                    >
                                      ▶
                                    </span>
                                  </button>

                                  <span className="mt-1 inline-flex select-none items-center rounded border border-gray-200 bg-gray-50 px-2 text-xs font-medium text-gray-700">
                                    Theme
                                  </span>

                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-gray-900">
                                      {t.name || t.code}
                                    </div>
                                    {t.description && (
                                      <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                        {t.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="self-center text-center text-sm text-gray-700">
                                {t.code}
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                <ActionIcon title="Add Subtheme (coming soon)" disabled>
                                  <Plus className="h-4 w-4" />
                                </ActionIcon>
                                <ActionIcon title="Edit Theme (coming soon)" disabled>
                                  <Pencil className="h-4 w-4" />
                                </ActionIcon>
                                <ActionIcon title="Delete Theme (coming soon)" disabled>
                                  <Trash2 className="h-4 w-4" />
                                </ActionIcon>
                              </div>
                            </div>

                            {/* Subthemes */}
                            {isThemeOpen && tSubs.length > 0 && (
                              <div className="ml-6 mt-2">
                                <ul className="space-y-1">
                                  {tSubs.map((s) => (
                                    <li
                                      key={s.id || s.code}
                                      className="grid grid-cols-[1fr,120px,120px] items-start gap-2 rounded-md border border-gray-100 p-2"
                                    >
                                      <div className="flex items-start gap-2">
                                        {/* no caret for leaf */}
                                        <span className="mt-1 inline-flex select-none items-center rounded border border-gray-200 bg-gray-50 px-2 text-xs font-medium text-gray-700">
                                          Subtheme
                                        </span>
                                        <div className="min-w-0">
                                          <div className="truncate text-sm font-medium text-gray-900">
                                            {s.name || s.code}
                                          </div>
                                          {s.description && (
                                            <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                              {s.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="self-center text-center text-sm text-gray-700">
                                        {s.code}
                                      </div>

                                      <div className="flex items-center justify-center gap-2">
                                        <ActionIcon title="Edit Subtheme (coming soon)" disabled>
                                          <Pencil className="h-4 w-4" />
                                        </ActionIcon>
                                        <ActionIcon title="Delete Subtheme (coming soon)" disabled>
                                          <Trash2 className="h-4 w-4" />
                                        </ActionIcon>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
}
