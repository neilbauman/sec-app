// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import { hierarchyTagClasses } from "@/lib/ui";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  ChevronRight,
} from "lucide-react";

/** Local UI shapes to avoid import/type conflicts */
export type Pillar = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};
export type Theme = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_id?: string | null;
  pillar_code?: string | null;
};
export type Subtheme = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  theme_id?: string | null;
  theme_code?: string | null;
};

type Actions = Partial<{
  onAddPillar: () => void;
  onEditPillar: (p: Pillar) => void;
  onDeletePillar: (p: Pillar) => void;

  onAddTheme: (pillar: Pillar) => void;
  onEditTheme: (t: Theme) => void;
  onDeleteTheme: (t: Theme) => void;

  onAddSubtheme: (theme: Theme) => void;
  onEditSubtheme: (s: Subtheme) => void;
  onDeleteSubtheme: (s: Subtheme) => void;

  onImportCsv?: () => void; // placeholder hook
  onExportCsv?: () => void; // placeholder hook
}>;

export default function PrimaryFrameworkCards({
  pillars = [],
  themes = [],
  subthemes = [],
  defaultOpen = true,
  actions = {},
}: {
  pillars?: Pillar[];
  themes?: Theme[];
  subthemes?: Subtheme[];
  defaultOpen?: boolean;
  actions?: Actions;
}) {
  // open state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const sortedPillars = useMemo(
    () =>
      [...pillars].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      ),
    [pillars]
  );

  // Map pillar_code -> themes
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      const key = t.pillar_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    for (const key of Object.keys(map)) {
      map[key].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
    }
    return map;
  }, [themes]);

  // Map theme_code -> subthemes
  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const key = s.theme_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    for (const key of Object.keys(map)) {
      map[key].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
    }
    return map;
  }, [subthemes]);

  const togglePillar = (code: string) =>
    setOpenPillars((prev) => ({
      ...prev,
      [code]: prev[code] ?? defaultOpen ? !prev[code] : true,
    }));

  const toggleTheme = (code: string) =>
    setOpenThemes((prev) => ({
      ...prev,
      [code]: prev[code] ?? defaultOpen ? !prev[code] : true,
    }));

  const IconBtn = ({
    title,
    onClick,
    children,
  }: {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </button>
  );

  const HierarchyTag = ({
    level,
    text,
  }: {
    level: "pillar" | "theme" | "subtheme";
    text: string;
  }) => (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${hierarchyTagClasses[level]}`}
    >
      {text}
    </span>
  );

  const Caret = ({ open }: { open: boolean }) => (
    <ChevronRight
      className={`h-4 w-4 transition-transform ${
        open ? "rotate-90" : ""
      }`}
    />
  );

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="text-sm font-medium text-gray-600">
          Name & Description
        </div>
        <div className="flex items-center gap-2">
          <IconBtn title="Import CSV (placeholder)" onClick={actions.onImportCsv}>
            <Upload className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Export CSV (placeholder)" onClick={actions.onExportCsv}>
            <Download className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Add Pillar" onClick={actions.onAddPillar}>
            <Plus className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y">
        {sortedPillars.map((p) => {
          const isOpen = openPillars[p.code] ?? defaultOpen;
          const pillarThemes = themesByPillar[p.code] ?? [];

          return (
            <div key={p.code} className="px-4 py-3">
              {/* Pillar row */}
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => togglePillar(p.code)}
                  className="group flex min-w-0 items-start gap-2"
                >
                  {/* caret + tag block (unchanged size) */}
                  <div className="mt-0.5 flex items-center gap-2">
                    <Caret open={isOpen} />
                    <HierarchyTag level="pillar" text="Pillar" />
                  </div>

                  {/* name + description block (description aligns under name) */}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {p.name}
                    </div>
                    {p.description ? (
                      <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                        {p.description}
                      </div>
                    ) : null}
                  </div>
                </button>

                <div className="shrink-0">
                  <IconBtn title="Edit Pillar" onClick={() => actions.onEditPillar?.(p)}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn title="Delete Pillar" onClick={() => actions.onDeletePillar?.(p)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn title="Add Theme" onClick={() => actions.onAddTheme?.(p)}>
                    <Plus className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>

              {/* Themes */}
              {isOpen && pillarThemes.length > 0 && (
                <div className="mt-2 space-y-2 border-l pl-4">
                  {pillarThemes.map((t) => {
                    const tOpen = openThemes[t.code] ?? defaultOpen;
                    const tSubs = subthemesByTheme[t.code] ?? [];
                    return (
                      <div key={t.code} className="pt-2">
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => toggleTheme(t.code)}
                            className="group flex min-w-0 items-start gap-2"
                          >
                            <div className="mt-0.5 flex items-center gap-2">
                              <Caret open={tOpen} />
                              <HierarchyTag level="theme" text="Theme" />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-gray-900">
                                {t.name}
                              </div>
                              {t.description ? (
                                <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                  {t.description}
                                </div>
                              ) : null}
                            </div>
                          </button>

                          <div className="shrink-0">
                            <IconBtn title="Edit Theme" onClick={() => actions.onEditTheme?.(t)}>
                              <Pencil className="h-4 w-4" />
                            </IconBtn>
                            <IconBtn
                              title="Delete Theme"
                              onClick={() => actions.onDeleteTheme?.(t)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </IconBtn>
                            <IconBtn
                              title="Add Subtheme"
                              onClick={() => actions.onAddSubtheme?.(t)}
                            >
                              <Plus className="h-4 w-4" />
                            </IconBtn>
                          </div>
                        </div>

                        {/* Subthemes */}
                        {tOpen && tSubs.length > 0 && (
                          <div className="mt-2 space-y-2 border-l pl-4">
                            {tSubs.map((s) => (
                              <div key={s.code} className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-2">
                                  <div className="mt-0.5 flex items-center gap-2">
                                    {/* no caret at subtheme level */}
                                    <span className="inline-block w-4" />
                                    <HierarchyTag level="subtheme" text="Subtheme" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-gray-900">
                                      {s.name}
                                    </div>
                                    {s.description ? (
                                      <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                        {s.description}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <IconBtn
                                    title="Edit Subtheme"
                                    onClick={() => actions.onEditSubtheme?.(s)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </IconBtn>
                                  <IconBtn
                                    title="Delete Subtheme"
                                    onClick={() => actions.onDeleteSubtheme?.(s)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </IconBtn>
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
