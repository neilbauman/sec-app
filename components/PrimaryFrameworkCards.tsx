// /components/PrimaryFrameworkCards.tsx
"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Info } from "lucide-react";
import { Tag, Tooltip, ActionIcon, cn } from "@/lib/ui";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
};

function Caret({
  open,
  onToggle,
  isLeaf,
}: {
  open: boolean;
  onToggle?: () => void;
  isLeaf?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Collapse" : "Expand"}
      onClick={isLeaf ? undefined : onToggle}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50",
        isLeaf && "opacity-0 pointer-events-none"
      )}
    >
      {open ? (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

function Row({
  tag,
  code,
  name,
  description,
  right,
  depth = 0,
}: {
  tag: React.ReactNode;
  code?: string;
  name: string;
  description?: string | null;
  right?: React.ReactNode;
  depth?: number; // 0 pillar, 1 theme, 2 subtheme
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-2">
      {/* Tag + small code inline to the right of the tag */}
      <div className="flex items-center gap-2">
        {tag}
        {code ? <span className="text-xs text-gray-500">{code}</span> : null}
      </div>

      {/* Name + description stacked but left edge aligns with Name */}
      <div className="min-w-0">
        <div
          className={cn(
            "truncate text-sm font-medium text-gray-900",
            depth === 1 && "pl-4",
            depth === 2 && "pl-8"
          )}
          title={name}
        >
          {name}
        </div>
        {description ? (
          <div
            className={cn(
              "text-sm text-gray-600",
              depth === 1 && "pl-4",
              depth === 2 && "pl-8"
            )}
          >
            {description}
          </div>
        ) : null}
      </div>

      {/* Right-aligned actions */}
      <div className="flex items-center justify-end gap-2">{right}</div>
    </div>
  );
}

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
  actions,
}: Props) {
  // Build maps using STRING keys (our ids are strings in /types)
  const themesByPillar = React.useMemo(() => {
    const m = new Map<string, Theme[]>();
    for (const t of themes) {
      if (!t.pillar_id) continue;
      const arr = m.get(t.pillar_id) ?? [];
      arr.push(t);
      m.set(t.pillar_id, arr);
    }
    return m;
  }, [themes]);

  const subthemesByTheme = React.useMemo(() => {
    const m = new Map<string, Subtheme[]>();
    for (const st of subthemes) {
      if (!st.theme_id) continue;
      const arr = m.get(st.theme_id) ?? [];
      arr.push(st);
      m.set(st.theme_id, arr);
    }
    return m;
  }, [subthemes]);

  // Track open state
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(pillars.map((p) => [p.id, !!defaultOpen]))
  );
  const [openThemes, setOpenThemes] = React.useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));

  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  return (
    <section className="rounded-lg border bg-white shadow-sm">
      {/* header row to hold actions on the right so alignment is consistent */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-medium text-gray-700">Primary Framework</div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      <div className="px-4 py-2">
        {/* Pillars */}
        {pillars.map((pillar) => {
          const pOpen = !!openPillars[pillar.id];
          const pThemes = themesByPillar.get(pillar.id) ?? [];
          return (
            <div key={pillar.id} className="py-2">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                {/* caret (kept small) */}
                <Caret open={pOpen} onToggle={() => togglePillar(pillar.id)} isLeaf={pThemes.length === 0} />

                {/* pillar row */}
                <Row
                  tag={<Tag color="blue">Pillar</Tag>}
                  code={pillar.code}
                  name={pillar.name}
                  description={pillar.description ?? ""}
                  right={
                    <Tooltip content="Pillar info">
                      <ActionIcon title="Info">
                        <Info className="h-4 w-4 text-gray-400" />
                      </ActionIcon>
                    </Tooltip>
                  }
                  depth={0}
                />
              </div>

              {/* Themes under pillar */}
              {pOpen &&
                pThemes.map((theme) => {
                  const tOpen = !!openThemes[theme.id];
                  const tSubs = subthemesByTheme.get(theme.id) ?? [];
                  return (
                    <div key={theme.id} className="ml-6 py-2">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <Caret
                          open={tOpen}
                          onToggle={() => toggleTheme(theme.id)}
                          isLeaf={tSubs.length === 0}
                        />
                        <Row
                          tag={<Tag color="green">Theme</Tag>}
                          code={theme.code}
                          name={theme.name}
                          description={theme.description ?? ""}
                          right={
                            <Tooltip content="Theme info">
                              <ActionIcon title="Info">
                                <Info className="h-4 w-4 text-gray-400" />
                              </ActionIcon>
                            </Tooltip>
                          }
                          depth={1}
                        />
                      </div>

                      {/* Subthemes under theme */}
                      {tOpen &&
                        tSubs.map((sub) => (
                          <div key={sub.id} className="ml-6 py-1">
                            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                              {/* leaf rows get an invisible caret placeholder to keep columns aligned */}
                              <div className="h-6 w-6" />

                              <Row
                                tag={<Tag color="red">Subtheme</Tag>}
                                code={sub.code}
                                name={sub.name}
                                description={sub.description ?? ""}
                                right={
                                  <Tooltip content="Subtheme info">
                                    <ActionIcon title="Info">
                                      <Info className="h-4 w-4 text-gray-400" />
                                    </ActionIcon>
                                  </Tooltip>
                                }
                                depth={2}
                              />
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
