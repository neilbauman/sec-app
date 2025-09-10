// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

/** Optional action handlers (not required yet; we default to no-ops). */
export type Entity = "pillar" | "theme" | "subtheme";
export type Actions = {
  updateName?: (entity: Entity, code: string, name: string) => Promise<void> | void;
  updateDescription?: (entity: Entity, code: string, description: string) => Promise<void> | void;
  updateSort?: (entity: Entity, code: string, sort: number) => Promise<void> | void;
  bumpSort?: (entity: Entity, code: string, delta: number) => Promise<void> | void;
};

type Props = {
  defaultOpen?: boolean; // collapsed by default unless true
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions;
};

function getPillarCode(p: Pillar): string {
  // canonical key
  return (p as any)?.code ?? "";
}
function getThemePillarKey(t: Theme): string {
  // how a theme connects to its pillar
  return (t as any)?.pillar_code ?? (t as any)?.pillar ?? "";
}
function getThemeCode(t: Theme): string {
  return (t as any)?.code ?? "";
}
function getSubthemeThemeKey(s: Subtheme): string {
  // how a subtheme connects to its theme
  return (s as any)?.theme_code ?? (s as any)?.theme ?? (s as any)?.parent_code ?? "";
}
function getName(x: any): string {
  return x?.name ?? "";
}
function getDescription(x: any): string {
  return x?.description ?? "";
}
function getSort(x: any): number {
  return (x?.sort ?? x?.sort_order ?? 0) as number;
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // Safe no-ops until wired
  const noopActions: Required<Actions> = {
    updateName: async () => {},
    updateDescription: async () => {},
    updateSort: async () => {},
    bumpSort: async () => {},
  };
  const act = { ...noopActions, ...actions };

  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Group themes by pillar
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = getThemePillarKey(t);
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    // Stable sort for display (by sort then name)
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => {
        const sa = getSort(a);
        const sb = getSort(b);
        return sa === sb ? getName(a).localeCompare(getName(b)) : sa - sb;
      });
    }
    return m;
  }, [themes]);

  // Group subthemes by theme
  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = getSubthemeThemeKey(s);
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => {
        const sa = getSort(a);
        const sb = getSort(b);
        return sa === sb ? getName(a).localeCompare(getName(b)) : sa - sb;
      });
    }
    return m;
  }, [subthemes]);

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !(s[code] ?? defaultOpen) }));
  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !(s[code] ?? defaultOpen) }));

  return (
    <div className="mt-6 rounded-xl border bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,110px,140px] items-center border-b bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
        <div>Name / Description</div>
        <div className="text-right pr-2">Sort</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => {
            const sa = getSort(a);
            const sb = getSort(b);
            return sa === sb ? getName(a).localeCompare(getName(b)) : sa - sb;
          })
          .map((p) => {
            const pCode = getPillarCode(p);
            const pillarOpen = openPillars[pCode] ?? defaultOpen;
            const pThemes = themesByPillar[pCode] ?? [];

            return (
              <div key={pCode} className="bg-white">
                {/* Pillar row */}
                <Row
                  level={0}
                  tag={{ label: "Pillar", color: "blue" }}
                  code={pCode}
                  name={getName(p)}
                  description={getDescription(p)}
                  sort={getSort(p)}
                  isOpen={pillarOpen}
                  onToggle={() => togglePillar(pCode)}
                  actions={act}
                  entity="pillar"
                />

                {/* Theme rows (render only when pillar is open) */}
                {pillarOpen &&
                  pThemes.map((t) => {
                    const tCode = getThemeCode(t);
                    const themeOpen = openThemes[tCode] ?? defaultOpen;
                    const tSubs = subthemesByTheme[tCode] ?? [];

                    return (
                      <div key={tCode}>
                        <Row
                          level={1}
                          tag={{ label: "Theme", color: "green" }}
                          code={tCode}
                          name={getName(t)}
                          description={getDescription(t)}
                          sort={getSort(t)}
                          isOpen={themeOpen}
                          onToggle={() => toggleTheme(tCode)}
                          actions={act}
                          entity="theme"
                        />

                        {/* Subtheme rows (render right under its theme when open) */}
                        {themeOpen &&
                          tSubs.map((s) => {
                            const sCode = (s as any)?.code ?? "";
                            return (
                              <Row
                                key={sCode}
                                level={2}
                                tag={{ label: "Subtheme", color: "red" }}
                                code={sCode}
                                name={getName(s)}
                                description={getDescription(s)}
                                sort={getSort(s)}
                                // leaf rows have no caret
                                isOpen={false}
                                onToggle={undefined}
                                actions={act}
                                entity="subtheme"
                              />
                            );
                          })}
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

function Row(props: {
  level: 0 | 1 | 2;
  tag: { label: "Pillar" | "Theme" | "Subtheme"; color: "blue" | "green" | "red" };
  code: string;
  name: string;
  description?: string;
  sort: number;
  isOpen: boolean;
  onToggle?: () => void;
  actions: Required<Actions>;
  entity: Entity;
}) {
  const { level, tag, code, name, description, sort, isOpen, onToggle, actions, entity } = props;

  const leftPad =
    level === 0 ? "pl-2" : level === 1 ? "pl-6" : "pl-10"; // indent name area by level

  const tagColors =
    tag.color === "blue"
      ? "bg-blue-100 text-blue-700 ring-blue-200"
      : tag.color === "green"
      ? "bg-green-100 text-green-700 ring-green-200"
      : "bg-red-100 text-red-700 ring-red-200";

  return (
    <div className="grid grid-cols-[1fr,110px,140px] items-stretch">
      {/* Name / Description */}
      <div className={`flex items-start gap-2 py-2 pr-2 ${leftPad}`}>
        {/* Caret */}
        <button
          type="button"
          onClick={onToggle}
          disabled={!onToggle}
          className={`mt-0.5 h-6 w-6 shrink-0 rounded hover:bg-gray-100 ${
            onToggle ? "text-gray-600" : "invisible"
          }`}
          aria-label={isOpen ? "Collapse" : "Expand"}
          title={isOpen ? "Collapse" : "Expand"}
        >
          <span className="inline-block transition-transform" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
            ▶
          </span>
        </button>

        {/* Tag + code + name/description */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ring-1 ${tagColors}`}>
              {tag.label}
            </span>
            <span className="text-[11px] font-semibold text-gray-400">{code}</span>
            <span className="truncate text-sm font-medium text-gray-900">{name}</span>
          </div>
          {description && (
            <div className="mt-0.5 text-[13px] leading-snug text-gray-600">{description}</div>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-end gap-1 px-2">
        <span className="text-sm tabular-nums text-gray-700">{Number.isFinite(sort) ? sort : 0}</span>
      </div>

      {/* Actions (placeholders / safe no-ops) */}
      <div className="flex items-center justify-end gap-2 px-2">
        <button
          type="button"
          onClick={() => actions.bumpSort(entity, code, -1)}
          className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => actions.bumpSort(entity, code, +1)}
          className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={() => actions.updateName(entity, code, name)}
          className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
