"use client";

import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Info } from "lucide-react";
import { cn, Tag, Tooltip, ActionIcon } from "@/lib/ui";
import { useMemo, useState, useCallback } from "react";

type Props = {
  defaultOpen?: boolean;
  data: {
    pillars: Pillar[];
    themes: Theme[];
    subthemes: Subtheme[];
  };
  /** reserved for future row-level actions; keeps the action column aligned */
  actions?: {};
};

export default function PrimaryFrameworkCards({ defaultOpen = false, data }: Props) {
  const { pillars, themes, subthemes } = data;

  // Build lookups
  const themesByPillar = useMemo(() => {
    const m = new Map<string, Theme[]>();
    for (const t of themes) {
      if (!t.pillar_id) continue;
      const arr = m.get(t.pillar_id) ?? [];
      arr.push(t);
      m.set(t.pillar_id, arr);
    }
    // ensure sort
    for (const [k, arr] of m) arr.sort((a, b) => a.sort_order - b.sort_order);
    return m;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const m = new Map<string, Subtheme[]>();
    for (const s of subthemes) {
      if (!s.theme_id) continue;
      const arr = m.get(s.theme_id) ?? [];
      arr.push(s);
      m.set(s.theme_id, arr);
    }
    for (const [k, arr] of m) arr.sort((a, b) => a.sort_order - b.sort_order);
    return m;
  }, [subthemes]);

  // expansion state (keys: pillar:ID or theme:ID)
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    if (!defaultOpen) return {};
    const o: Record<string, boolean> = {};
    for (const p of pillars) o[`pillar:${p.id}`] = true;
    for (const t of themes) o[`theme:${t.id}`] = true;
    return o;
  });

  const toggle = useCallback((key: string) => {
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  }, []);

  return (
    <div className="divide-y rounded-lg border bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[24px_auto_1fr_minmax(140px,auto)_minmax(64px,auto)] items-center gap-3 px-4 py-2 text-xs font-medium text-gray-500">
        <div /> {/* caret col */}
        <div>Hierarchy</div>
        <div>Description</div>
        <div className="justify-self-end">Sort</div>
        <div className="justify-self-end">Actions</div>
      </div>

      {/* Pillars */}
      <div className="divide-y">
        {pillars
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((pillar) => {
            const pKey = `pillar:${pillar.id}`;
            const pOpen = !!open[pKey];
            const pillarThemes = themesByPillar.get(pillar.id) ?? [];
            return (
              <Row
                key={pillar.id}
                level="pillar"
                open={pOpen}
                onToggle={() => toggle(pKey)}
                tag={<Tag.Pillar>Pillar</Tag.Pillar>}
                code={pillar.code}
                name={pillar.name}
                description={pillar.description ?? ""}
                sortOrder={pillar.sort_order}
                actions={<RowActions />}
              >
                {/* Themes */}
                {pillarThemes.map((theme) => {
                  const tKey = `theme:${theme.id}`;
                  const tOpen = !!open[tKey];
                  const themeSubs = subthemesByTheme.get(theme.id) ?? [];
                  return (
                    <Row
                      key={theme.id}
                      level="theme"
                      open={tOpen}
                      onToggle={() => toggle(tKey)}
                      tag={<Tag.Theme>Theme</Tag.Theme>}
                      code={theme.code}
                      name={theme.name}
                      description={theme.description ?? ""}
                      sortOrder={theme.sort_order}
                      actions={<RowActions />}
                    >
                      {/* Subthemes */}
                      {themeSubs.map((sub) => (
                        <Row
                          key={sub.id}
                          level="subtheme"
                          open={false}
                          isLeaf
                          onToggle={() => {}}
                          tag={<Tag.Subtheme>Subtheme</Tag.Subtheme>}
                          code={sub.code}
                          name={sub.name}
                          description={sub.description ?? ""}
                          sortOrder={sub.sort_order}
                          actions={<RowActions />}
                        />
                      ))}
                    </Row>
                  );
                })}
              </Row>
            );
          })}
      </div>
    </div>
  );
}

/** Right-side actions placeholder (keeps column aligned) */
function RowActions() {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="Details">
        <ActionIcon aria-label="details">
          <Info className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}

function Caret({ open, hidden, onClick }: { open?: boolean; hidden?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn("inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50", {
        "opacity-0 pointer-events-none": !!hidden,
      })}
      onClick={hidden ? undefined : onClick}
      aria-label={open ? "Collapse" : "Expand"}
    >
      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
}

function Row(props: {
  level: "pillar" | "theme" | "subtheme";
  tag: React.ReactNode;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  actions?: React.ReactNode;
  open?: boolean;
  isLeaf?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}) {
  const { level, tag, code, name, description, sortOrder, actions, open, isLeaf, onToggle, children } = props;

  return (
    <div className="grid grid-cols-[24px_auto_1fr_minmax(140px,auto)_minmax(64px,auto)] items-start gap-3 px-4 py-3">
      <Caret open={open} hidden={isLeaf} onClick={onToggle} />

      {/* Hierarchy cell: tag + name + small grey code to the right */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div>{tag}</div>
          <div className="truncate font-medium">{name}</div>
          <div className="text-xs text-gray-500">{code}</div>
        </div>
      </div>

      {/* Description — aligned with the left of the name (same column) */}
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-700">{description}</p>
      </div>

      {/* Sort order (right aligned) */}
      <div className="justify-self-end text-sm tabular-nums text-gray-700">{sortOrder}</div>

      {/* Actions (right aligned) */}
      <div className="justify-self-end">{actions}</div>

      {/* Children rows */}
      {open && !isLeaf ? <div className="col-span-5">{children}</div> : null}
    </div>
  );
}
