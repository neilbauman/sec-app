// components/PrimaryFrameworkCards.tsx
"use client";

import React from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { Caret, Card, Tag, Tooltip, ActionIcon } from "@/lib/ui";
import { Info } from "lucide-react";
import clsx from "clsx";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: React.ReactNode; // keeps the right-side actions cell aligned
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // open-state per pillar/theme
  const [openPillar, setOpenPillar] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(pillars.map((p) => [p.id, defaultOpen]))
  );
  const [openTheme, setOpenTheme] = React.useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setOpenPillar((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenTheme((s) => ({ ...s, [id]: !s[id] }));

  // indexing helpers
  const themesByPillar = React.useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      const pid = t.pillar_id ?? "";
      (map[pid] ||= []).push(t);
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [themes]);

  const subthemesByTheme = React.useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const tid = s.theme_id ?? "";
      (map[tid] ||= []).push(s);
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [subthemes]);

  return (
    <Card>
      {/* header row */}
      <div className="grid grid-cols-[24px_minmax(0,1fr)_140px_80px_120px] items-center gap-2 border-b px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        <span />{/* caret */}
        <span>Hierarchy</span>
        <span className="text-right">Code</span>
        <span className="text-right">Sort</span>
        <span className="text-right">Actions</span>
      </div>

      {/* body */}
      <div className="divide-y">
        {pillars.sort((a, b) => a.sort_order - b.sort_order).map((pillar) => {
          const pOpen = !!openPillar[pillar.id];
          const pThemes = themesByPillar[pillar.id] ?? [];

          return (
            <div key={pillar.id} className="px-2 py-1">
              {/* Pillar row */}
              <Row
                caret={<Caret open={pOpen} onToggle={() => togglePillar(pillar.id)} />}
                tag={<Tag color="blue">Pillar</Tag>}
                name={pillar.name}
                description={pillar.description ?? ""}
                code={pillar.code}
                sort={pillar.sort_order}
                actions={actions}
              />

              {/* Themes under pillar */}
              {pOpen &&
                pThemes.map((theme) => {
                  const tOpen = !!openTheme[theme.id];
                  const tSubs = subthemesByTheme[theme.id] ?? [];
                  return (
                    <div key={theme.id}>
                      <Row
                        indent={1}
                        caret={<Caret open={tOpen} onToggle={() => toggleTheme(theme.id)} />}
                        tag={<Tag color="green">Theme</Tag>}
                        name={theme.name}
                        description={theme.description ?? ""}
                        code={theme.code}
                        sort={theme.sort_order}
                        actions={actions}
                      />
                      {tOpen &&
                        tSubs.map((sub) => (
                          <Row
                            key={sub.id}
                            indent={2}
                            caret={<span className="inline-block h-6 w-6" />} // keeps alignment; subthemes don’t expand
                            tag={<Tag color="red">Subtheme</Tag>}
                            name={sub.name}
                            description={sub.description ?? ""}
                            code={sub.code}
                            sort={sub.sort_order}
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
    </Card>
  );
}

/** One visual row (+ its description line) in the table */
function Row({
  indent = 0,
  caret,
  tag,
  name,
  code,
  sort,
  description,
  actions,
}: {
  indent?: 0 | 1 | 2;
  caret: React.ReactNode;
  tag: React.ReactNode;
  name: string;
  code: string | null | undefined;
  sort: number;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pad = indent === 0 ? "" : indent === 1 ? "pl-6" : "pl-12";

  return (
    <div className={clsx("grid grid-cols-[24px_minmax(0,1fr)_140px_80px_120px] gap-2 px-2 py-2")}>
      {/* caret */}
      <div className="flex items-start justify-center pt-0.5">{caret}</div>

      {/* hierarchy cell: tag + name (same row), then description starts under the name edge */}
      <div className={clsx("min-w-0", pad)}>
        <div className="flex items-center gap-2">
          {tag}
          <div className="truncate font-medium text-gray-900">{name}</div>
          <Tooltip content="Metadata code (not editable here)">
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </Tooltip>
        </div>
        {description ? (
          <div className="mt-1 text-sm text-gray-600">
            {description}
          </div>
        ) : null}
      </div>

      {/* code column (small gray, right aligned) */}
      <div className="flex items-center justify-end">
        <span className="text-[11px] text-gray-500">{code}</span>
      </div>

      {/* sort column */}
      <div className="flex items-center justify-end">
        <span className="text-sm tabular-nums text-gray-700">{sort}</span>
      </div>

      {/* actions column (right aligned) */}
      <div className="flex items-center justify-end">{actions}</div>
    </div>
  );
}
