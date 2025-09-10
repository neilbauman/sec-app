// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight } from "lucide-react";

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  defaultOpen?: boolean; // optional: expand all by default
};

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
}: Props) {
  // groupings
  const { themesByPillar, subthemesByTheme } = useMemo(() => {
    const tByP: Record<string, Theme[]> = {};
    for (const t of [...themes].sort(bySort)) {
      (tByP[t.pillar_code] ??= []).push(t);
    }

    const sByT: Record<string, Subtheme[]> = {};
    for (const s of [...subthemes].sort(bySort)) {
      (sByT[s.theme_code] ??= []).push(s);
    }

    return { themesByPillar: tByP, subthemesByTheme: sByT };
  }, [themes, subthemes]);

  // expansion state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(pillars.map((p) => [p.code, !!defaultOpen])),
  );
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !s[code] }));
  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !s[code] }));

  return (
    <div className="rounded-xl border bg-white">
      {/* Header */}
      <div className="grid grid-cols-[28px_minmax(0,1fr)_110px_130px] items-center gap-3 px-4 py-3 text-xs font-medium text-slate-500">
        <div /> {/* caret spacer */}
        <div>Name & description</div>
        <div className="text-right">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y">
        {/* Pillars */}
        {[...pillars].sort(bySort).map((p) => {
          const isPillarOpen = !!openPillars[p.code];
          const pillarThemes = themesByPillar[p.code] ?? [];

          return (
            <div key={p.code} className="contents">
              {/* Pillar row */}
              <Row
                level="pillar"
                isOpen={isPillarOpen}
                onToggle={() => togglePillar(p.code)}
                code={p.code}
                name={p.name}
                description={p.description}
                sort={p.sort_order ?? 0}
              />

              {/* Nested themes (only when pillar open) */}
              {isPillarOpen &&
                pillarThemes.map((t) => {
                  const isThemeOpen = !!openThemes[t.code];
                  const themeSubthemes = subthemesByTheme[t.code] ?? [];

                  return (
                    <div key={t.code} className="contents">
                      {/* Theme row */}
                      <Row
                        level="theme"
                        isOpen={isThemeOpen}
                        onToggle={() => toggleTheme(t.code)}
                        code={t.code}
                        name={t.name}
                        description={t.description}
                        sort={t.sort_order ?? 0}
                      />

                      {/* Immediately nested subthemes (under this theme, not at bottom) */}
                      {isThemeOpen &&
                        themeSubthemes.map((s) => (
                          <Row
                            key={s.code}
                            level="subtheme"
                            isOpen={false}
                            onToggle={undefined}
                            code={s.code}
                            name={s.name}
                            description={s.description}
                            sort={s.sort_order ?? 0}
                          />
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

/* ---------- Helpers ---------- */

function bySort(a: { sort_order?: number | null }, b: { sort_order?: number | null }) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

type Level = "pillar" | "theme" | "subtheme";

function Row({
  level,
  isOpen,
  onToggle,
  code,
  name,
  description,
  sort,
}: {
  level: Level;
  isOpen: boolean;
  onToggle?: () => void;
  code: string;
  name: string;
  description?: string | null;
  sort: number;
}) {
  const tagStyles =
    level === "pillar"
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      : level === "theme"
      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";

  const indent =
    level === "pillar" ? "" : level === "theme" ? "pl-6" : "pl-12";

  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)_110px_130px] items-center gap-3 px-4 py-3">
      {/* caret */}
      <div className="flex h-5 items-center justify-center">
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            className="h-5 w-5 rounded hover:bg-slate-100"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </button>
        ) : (
          <div className="h-5 w-5" />
        )}
      </div>

      {/* name & description */}
      <div className={`min-w-0 ${indent}`}>
        <div className="flex items-center gap-2">
          <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-medium ${tagStyles}`}>
            {level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme"}
          </span>
          <span className="text-[10px] font-medium text-slate-400">{code}</span>
          <span className="truncate text-sm font-medium text-slate-900">{name}</span>
        </div>
        {description ? (
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      {/* sort order */}
      <div className="text-right text-sm tabular-nums text-slate-500">{sort}</div>

      {/* actions (placeholder) */}
      <div className="flex justify-end gap-2">
        <button className="rounded-md border px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
          Edit
        </button>
        <button className="rounded-md border px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
          Delete
        </button>
      </div>
    </div>
  );
}
