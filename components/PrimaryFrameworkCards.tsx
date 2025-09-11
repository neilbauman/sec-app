// components/PrimaryFrameworkCards.tsx
"use client";

import * as React from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Info } from "lucide-react";
import { Tag, Tooltip, ActionIcon, Card, cn } from "@/lib/ui";

type Props = {
  defaultOpen?: boolean;
  data: {
    pillars: Pillar[];
    themes: Theme[];
    subthemes: Subtheme[];
  };
  actions?: React.ReactNode; // optional global actions area (kept for parity)
};

type Key = string | number;

export default function PrimaryFrameworkCards({ defaultOpen, data }: Props) {
  // index children by parent
  const themesByPillar = React.useMemo(() => {
    const map: Record<Key, Theme[]> = {};
    for (const t of data.themes) {
      (map[t.pillar_id] ??= []).push(t);
    }
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    return map;
  }, [data.themes]);

  const subthemesByTheme = React.useMemo(() => {
    const map: Record<Key, Subtheme[]> = {};
    for (const s of data.subthemes) {
      (map[s.theme_id] ??= []).push(s);
    }
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    return map;
  }, [data.subthemes]);

  // open state
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const base: Record<string, boolean> = {};
    if (defaultOpen) {
      for (const p of data.pillars) base[`p-${p.id}`] = true;
      for (const t of data.themes) base[`t-${t.id}`] = true;
    }
    return base;
  });
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <Card className="mx-auto max-w-6xl">
      <div className="divide-y">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-500">
          <div className="pl-7">Hierarchy</div>
          <div className="pl-1">Name & Description</div>
          <div className="text-right">Sort</div>
          <div className="text-right pr-1">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {data.pillars
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((pillar) => {
              const pKey = `p-${pillar.id}`;
              const pOpen = !!open[pKey];
              const pillarThemes = themesByPillar[pillar.id] ?? [];
              return (
                <React.Fragment key={pKey}>
                  <Row
                    level="pillar"
                    open={pOpen}
                    onToggle={() => toggle(pKey)}
                    tag={<Tag color="blue">Pillar</Tag>}
                    code={pillar.code}
                    name={pillar.name}
                    description={pillar.description ?? ""}
                    sort={pillar.sort_order ?? 0}
                    actions={<RowActions level="pillar" />}
                  />

                  {pOpen &&
                    pillarThemes.map((theme) => {
                      const tKey = `t-${theme.id}`;
                      const tOpen = !!open[tKey];
                      const themeSubs = subthemesByTheme[theme.id] ?? [];
                      return (
                        <React.Fragment key={tKey}>
                          <Row
                            level="theme"
                            open={tOpen}
                            onToggle={() => toggle(tKey)}
                            tag={<Tag color="green">Theme</Tag>}
                            code={theme.code}
                            name={theme.name}
                            description={theme.description ?? ""}
                            sort={theme.sort_order ?? 0}
                            actions={<RowActions level="theme" />}
                          />
                          {tOpen &&
                            themeSubs.map((sub) => {
                              const sKey = `s-${sub.id}`;
                              return (
                                <Row
                                  key={sKey}
                                  level="subtheme"
                                  open={false}
                                  onToggle={() => {}}
                                  tag={<Tag color="red">Subtheme</Tag>}
                                  code={sub.code}
                                  name={sub.name}
                                  description={sub.description ?? ""}
                                  sort={sub.sort_order ?? 0}
                                  actions={<RowActions level="subtheme" leaf />}
                                />
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </Card>
  );
}

function Row({
  level,
  open,
  onToggle,
  tag,
  code,
  name,
  description,
  sort,
  actions,
}: {
  level: "pillar" | "theme" | "subtheme";
  open: boolean;
  onToggle: () => void;
  tag: React.ReactNode;
  code: string;
  name: string;
  description: string;
  sort: number;
  actions: React.ReactNode;
}) {
  const isLeaf = level === "subtheme";
  const caret =
    level === "subtheme" ? (
      <span className="inline-block w-4" />
    ) : open ? (
      <ChevronDown className="h-4 w-4 text-gray-500" />
    ) : (
      <ChevronRight className="h-4 w-4 text-gray-500" />
    );

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3">
      {/* Col 1: caret + tag + code (code small & gray to the RIGHT of the tag) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn("inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50", {
            "opacity-0 pointer-events-none": isLeaf,
          })}
          onClick={isLeaf ? undefined : onToggle}
          aria-label="Toggle"
        >
          {caret}
        </button>
        <div className="flex items-center gap-2">
          {tag}
          <span className="text-xs text-gray-500">{code}</span>
        </div>
      </div>

      {/* Col 2: name + description (description aligned with name left edge) */}
      <div className="min-w-0">
        <div className="truncate font-medium text-gray-900">{name}</div>
        {description ? (
          <div className="truncate text-sm text-gray-600">{description}</div>
        ) : null}
      </div>

      {/* Col 3: sort (right aligned) */}
      <div className="text-right tabular-nums text-gray-700">{sort}</div>

      {/* Col 4: actions (right aligned) */}
      <div className="flex items-center justify-end">{actions}</div>
    </div>
  );
}

function RowActions({ level, leaf }: { level: "pillar" | "theme" | "subtheme"; leaf?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <Tooltip label={`Info about ${level}`}>
        <ActionIcon aria-label="Info">
          <Info className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
      {/* add more action icons later */}
      {leaf ? null : <span className="sr-only">Expandable</span>}
    </div>
  );
}
