"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, Edit3, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

type Entity = "pillar" | "theme" | "subtheme";

export type FrameworkActions = {
  updateName?: (entity: Entity, code: string, name: string) => Promise<void>;
  updateDescription?: (entity: Entity, code: string, description: string) => Promise<void>;
  updateSort?: (entity: Entity, code: string, sort: number) => Promise<void>;
  bumpSort?: (entity: Entity, code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: FrameworkActions; // optional => safe to pass {}
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const isReadOnly = !actions || (!actions.updateName && !actions.updateDescription && !actions.updateSort && !actions.bumpSort);

  // group themes by pillar_code
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = (t as any).pillar_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    return m;
  }, [themes]);

  // group subthemes by theme_code
  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = (s as any).theme_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    return m;
  }, [subthemes]);

  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (code: string) =>
    setOpenPillars((prev) => ({ ...prev, [code]: !(prev[code] ?? defaultOpen) }));
  const toggleTheme = (code: string) =>
    setOpenThemes((prev) => ({ ...prev, [code]: !(prev[code] ?? defaultOpen) }));

  return (
    <div className="mt-4 rounded-xl border shadow-sm">
      {/* Header row */}
      <div className="grid grid-cols-[1fr,96px,112px] items-center border-b bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
        <div>Name & description</div>
        <div className="text-right pr-2">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y">
        {/* Pillars */}
        {(pillars ?? [])
          .slice()
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((p) => {
            const pOpen = openPillars[p.code] ?? defaultOpen;
            const pillarThemes = (themesByPillar[p.code] ?? []).slice().sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
            return (
              <div key={p.code} className="bg-white">
                <Row
                  level="pillar"
                  code={p.code}
                  name={p.name}
                  description={p.description ?? ""}
                  sort={Number((p as any).sort_order ?? 0)}
                  open={pOpen}
                  onToggle={() => togglePillar(p.code)}
                  readOnly={isReadOnly}
                  actions={actions}
                />

                {/* Themes under this pillar */}
                {pOpen &&
                  pillarThemes.map((t) => {
                    const tOpen = openThemes[t.code] ?? defaultOpen;
                    const tSubthemes = (subthemesByTheme[t.code] ?? [])
                      .slice()
                      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
                    return (
                      <div key={t.code} className="bg-white">
                        <Row
                          level="theme"
                          code={t.code}
                          name={t.name}
                          description={t.description ?? ""}
                          sort={Number((t as any).sort_order ?? 0)}
                          open={tOpen}
                          onToggle={() => toggleTheme(t.code)}
                          readOnly={isReadOnly}
                          actions={actions}
                        />

                        {/* Subthemes directly under this theme */}
                        {tOpen &&
                          tSubthemes.map((s) => (
                            <Row
                              key={s.code}
                              level="subtheme"
                              code={s.code}
                              name={s.name}
                              description={s.description ?? ""}
                              sort={Number((s as any).sort_order ?? 0)}
                              open={false}
                              onToggle={undefined}
                              readOnly={isReadOnly}
                              actions={actions}
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

/** Single row renderer with tighter spacing and bigger chevrons */
function Row({
  level,
  code,
  name,
  description,
  sort,
  open,
  onToggle,
  readOnly,
  actions,
}: {
  level: Entity;
  code: string;
  name: string;
  description: string;
  sort: number;
  open: boolean;
  onToggle?: () => void;
  readOnly: boolean;
  actions?: FrameworkActions;
}) {
  const tagStyles =
    level === "pillar"
      ? "bg-blue-100 text-blue-700"
      : level === "theme"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  const indent =
    level === "pillar" ? "" : level === "theme" ? "pl-6" : "pl-12";

  return (
    <div className={`grid grid-cols-[1fr,96px,112px] items-center px-3 py-2`}>
      {/* name / description cell */}
      <div className={`flex items-start gap-2 ${indent}`}>
        {/* chevron */}
        <button
          type="button"
          onClick={onToggle}
          disabled={!onToggle}
          className={`mt-0.5 h-6 w-6 flex-none rounded hover:bg-slate-100 transition disabled:opacity-30 disabled:hover:bg-transparent`}
          aria-label={onToggle ? (open ? "Collapse" : "Expand") : "No children"}
        >
          <ChevronRight
            className={`mx-auto h-5 w-5 transition-transform ${open ? "rotate-90" : ""} ${onToggle ? "text-slate-600" : "text-slate-300"}`}
          />
        </button>

        {/* tag + code + name/description */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-5 items-center rounded px-2 text-[11px] font-medium ${tagStyles}`}>
              {level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme"}
            </span>
            <span className="text-xs font-medium text-slate-400">{code}</span>
            <span className="truncate text-[15px] font-medium text-slate-900">{name}</span>
          </div>
          {description && (
            <div className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">{description}</div>
          )}
        </div>
      </div>

      {/* sort */}
      <div className="pr-2 text-right text-sm tabular-nums text-slate-600">{sort}</div>

      {/* actions */}
      <div className="flex justify-end gap-1">
        {/* drag handle (placeholder) */}
        <IconButton title="Reorder (placeholder)" disabled>
          <GripVertical className="h-4 w-4" />
        </IconButton>

        {/* bump sort */}
        <IconButton
          title="Move up"
          disabled={readOnly || !actions?.bumpSort}
          onClick={async () => actions?.bumpSort?.(level, code, -1)}
        >
          <ArrowUp className="h-4 w-4" />
        </IconButton>
        <IconButton
          title="Move down"
          disabled={readOnly || !actions?.bumpSort}
          onClick={async () => actions?.bumpSort?.(level, code, +1)}
        >
          <ArrowDown className="h-4 w-4" />
        </IconButton>

        {/* edit (placeholder if read-only) */}
        <IconButton
          title={readOnly ? "Edit (disabled)" : "Edit"}
          disabled={readOnly || !actions?.updateName}
          onClick={async () => {
            if (!actions?.updateName) return;
            // trivial prompt-based edit to keep UI minimal for now
            const newName = window.prompt("New name:", name);
            if (newName && newName.trim() !== name) {
              await actions.updateName(level, code, newName.trim());
            }
          }}
        >
          <Edit3 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  title,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
