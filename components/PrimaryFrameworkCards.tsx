// components/PrimaryFrameworkCards.tsx
"use client";

import * as React from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { Info } from "lucide-react";
import {
  Card,
  Tooltip,
  ActionIcon,
  CaretButton,
  TagPillar,
  TagTheme,
  TagSubtheme,
} from "@/lib/ui";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: {
    onEditPillar?: (p: Pillar) => void;
    onEditTheme?: (t: Theme) => void;
    onEditSubtheme?: (s: Subtheme) => void;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // Expansion state
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    for (const p of pillars) o[`p:${p.id}`] = defaultOpen;
    for (const t of themes) o[`t:${t.id}`] = false;
    return o;
  });

  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const themesByPillar = React.useMemo(() => {
    const map = new Map<string, Theme[]>();
    for (const t of themes) {
      if (!t.pillar_id) continue;
      const arr = map.get(t.pillar_id) ?? [];
      arr.push(t);
      map.set(t.pillar_id, arr);
    }
    return map;
  }, [themes]);

  const subthemesByTheme = React.useMemo(() => {
    const map = new Map<string, Subtheme[]>();
    for (const s of subthemes) {
      if (!s.theme_id) continue;
      const arr = map.get(s.theme_id) ?? [];
      arr.push(s);
      map.set(s.theme_id, arr);
    }
    return map;
  }, [subthemes]);

  return (
    <Card className="mx-auto max-w-6xl">
      <div className="divide-y">
        {/* Header row */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 text-xs font-semibold text-gray-500">
          <div className="w-5" />
          <div className="flex items-center gap-2">
            <span>Hierarchy</span>
          </div>
          <div className="text-right">Sort</div>
          <div className="text-right pr-1">Actions</div>
        </div>

        {/* Pillars */}
        {pillars.map((pillar) => {
          const pKey = `p:${pillar.id}`;
          const pOpen = !!open[pKey];
          const pThemes = (themesByPillar.get(pillar.id) ?? []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          );

          return (
            <div key={pillar.id} className="px-4 py-2">
              {/* Pillar row */}
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3">
                {/* caret */}
                <div className="pt-1">
                  <CaretButton open={pOpen} onToggle={() => toggle(pKey)} />
                </div>

                {/* name area with tag + code + name + description aligned */}
                <div>
                  <div className="flex items-center gap-2">
                    <TagPillar>Pillar</TagPillar>
                    <span className="text-xs text-gray-500">{pillar.code}</span>
                    <span className="font-medium text-gray-900">{pillar.name}</span>
                    <Tooltip content="Pillar description">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Tooltip>
                  </div>
                  {pillar.description ? (
                    <div className="ml-[calc(0.5rem+0.5rem+2ch)] text-sm text-gray-600">
                      {/* left indent ≈ aligns with start of name (tag + code width) */}
                      {pillar.description}
                    </div>
                  ) : null}
                </div>

                {/* sort */}
                <div className="text-right text-sm text-gray-600">{pillar.sort_order}</div>

                {/* actions pinned right */}
                <div className="flex justify-end">
                  <ActionIcon aria-label="Edit pillar" onClick={() => actions?.onEditPillar?.(pillar)}>
                    ✎
                  </ActionIcon>
                </div>
              </div>

              {/* Themes */}
              {pOpen &&
                pThemes.map((theme) => {
                  const tKey = `t:${theme.id}`;
                  const tOpen = !!open[tKey];
                  const tSubs = (subthemesByTheme.get(theme.id) ?? []).sort(
                    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                  );

                  return (
                    <div key={theme.id} className="mt-2 pl-6">
                      {/* Theme row */}
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3">
                        <div className="pt-1">
                          <CaretButton open={tOpen} onToggle={() => toggle(tKey)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <TagTheme>Theme</TagTheme>
                            <span className="text-xs text-gray-500">{theme.code}</span>
                            <span className="font-medium text-gray-900">{theme.name}</span>
                            <Tooltip content="Theme description">
                              <Info className="h-4 w-4 text-gray-400" />
                            </Tooltip>
                          </div>
                          {theme.description ? (
                            <div className="ml-[calc(0.5rem+0.5rem+2ch)] text-sm text-gray-600">
                              {theme.description}
                            </div>
                          ) : null}
                        </div>
                        <div className="text-right text-sm text-gray-600">{theme.sort_order}</div>
                        <div className="flex justify-end">
                          <ActionIcon aria-label="Edit theme" onClick={() => actions?.onEditTheme?.(theme)}>
                            ✎
                          </ActionIcon>
                        </div>
                      </div>

                      {/* Subthemes */}
                      {tOpen &&
                        tSubs.map((sub) => (
                          <div key={sub.id} className="mt-2 pl-6">
                            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3">
                              <div className="pt-1">
                                {/* leaf rows still show a small spacer to align with caret column */}
                                <span className="inline-block h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <TagSubtheme>Subtheme</TagSubtheme>
                                  <span className="text-xs text-gray-500">{sub.code}</span>
                                  <span className="font-medium text-gray-900">{sub.name}</span>
                                  <Tooltip content="Subtheme description">
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </Tooltip>
                                </div>
                                {sub.description ? (
                                  <div className="ml-[calc(0.5rem+0.5rem+2ch)] text-sm text-gray-600">
                                    {sub.description}
                                  </div>
                                ) : null}
                              </div>
                              <div className="text-right text-sm text-gray-600">{sub.sort_order}</div>
                              <div className="flex justify-end">
                                <ActionIcon aria-label="Edit subtheme" onClick={() => actions?.onEditSubtheme?.(sub)}>
                                  ✎
                                </ActionIcon>
                              </div>
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
    </Card>
  );
}
