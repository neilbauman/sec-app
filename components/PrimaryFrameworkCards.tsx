// components/PrimaryFrameworkCards.tsx
'use client';

import React, { useMemo, useState } from 'react';
import type { Pillar, Theme, Subtheme } from '@/types/framework';
import { ChevronRight, ChevronDown, Info } from 'lucide-react';
import { Card, Tag, Tooltip, ActionIcon } from '@/lib/ui';

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  /** If true, expand all accordions by default */
  defaultOpen?: boolean;
  /** Optional action handlers for future editing; right column stays aligned */
  actions?: {
    onEditPillar?: (p: Pillar) => void;
    onEditTheme?: (t: Theme) => void;
    onEditSubtheme?: (s: Subtheme) => void;
  };
};

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
  actions,
}: Props) {
  // Build lookups once
  const { themesByPillar, subsByTheme } = useMemo(() => {
    const tByP: Record<string, Theme[]> = {};
    for (const t of themes) {
      if (!t.pillar_id) continue;
      (tByP[t.pillar_id] ??= []).push(t);
    }
    const sByT: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      if (!s.theme_id) continue;
      (sByT[s.theme_id] ??= []).push(s);
    }
    // stable sort by sort_order
    for (const k of Object.keys(tByP)) tByP[k].sort((a, b) => a.sort_order - b.sort_order);
    for (const k of Object.keys(sByT)) sByT[k].sort((a, b) => a.sort_order - b.sort_order);
    return { themesByPillar: tByP, subsByTheme: sByT };
  }, [themes, subthemes]);

  // Open/close state keyed by id
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(() => {
    const obj: Record<string, boolean> = {};
    for (const p of pillars) obj[p.id] = !!defaultOpen;
    return obj;
  });
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setOpenPillars((m) => ({ ...m, [id]: !m[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((m) => ({ ...m, [id]: !m[id] }));

  return (
    <Card className="divide-y overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
        <div className="pl-7">Name</div>
        <div className="sr-only sm:not-sr-only sm:opacity-0">Description</div>
        <div className="text-right w-[64px] pr-2">Sort</div>
        <div className="w-[140px] text-right pr-1">Actions</div>
      </div>

      {/* Pillars */}
      {pillars
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((pillar) => {
          const pOpen = !!openPillars[pillar.id];
          const pThemes = themesByPillar[pillar.id] ?? [];

          return (
            <div key={pillar.id} className="divide-y">
              {/* Pillar row */}
              <Row
                level="pillar"
                open={pOpen}
                onToggle={() => togglePillar(pillar.id)}
                tag={<Tag color="blue">Pillar</Tag>}
                code={pillar.code}
                name={pillar.name}
                description={pillar.description ?? ''}
                sortOrder={pillar.sort_order}
                actions={
                  <RightActions
                    title="Pillar actions"
                    onEdit={actions?.onEditPillar ? () => actions.onEditPillar!(pillar) : undefined}
                  />
                }
                infoTooltip={`${pThemes.length} theme${pThemes.length === 1 ? '' : 's'}`}
              />

              {/* Themes under pillar */}
              {pOpen &&
                pThemes.map((theme) => {
                  const tOpen = !!openThemes[theme.id];
                  const tSubs = subsByTheme[theme.id] ?? [];
                  return (
                    <div key={theme.id} className="divide-y">
                      <Row
                        level="theme"
                        open={tOpen}
                        onToggle={() => toggleTheme(theme.id)}
                        tag={<Tag color="green">Theme</Tag>}
                        code={theme.code}
                        name={theme.name}
                        description={theme.description ?? ''}
                        sortOrder={theme.sort_order}
                        actions={
                          <RightActions
                            title="Theme actions"
                            onEdit={actions?.onEditTheme ? () => actions.onEditTheme!(theme) : undefined}
                          />
                        }
                        infoTooltip={`${tSubs.length} subtheme${tSubs.length === 1 ? '' : 's'}`}
                      />

                      {/* Subthemes under theme */}
                      {tOpen &&
                        tSubs.map((sub) => (
                          <Row
                            key={sub.id}
                            level="subtheme"
                            open={false}
                            // subthemes don’t toggle; caret remains as a fixed spacer
                            onToggle={undefined}
                            tag={<Tag color="red">Subtheme</Tag>}
                            code={sub.code}
                            name={sub.name}
                            description={sub.description ?? ''}
                            sortOrder={sub.sort_order}
                            actions={
                              <RightActions
                                title="Subtheme actions"
                                onEdit={actions?.onEditSubtheme ? () => actions.onEditSubtheme!(sub) : undefined}
                              />
                            }
                          />
                        ))}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </Card>
  );
}

/**
 * A single hierarchical row.
 * - Keeps caret the same size as lucide default.
 * - Puts Tag then Name (bold) with small gray Code to the right on the same line.
 * - Description is aligned with the left edge of the name (under it), not under the tag.
 * - Sort and Actions are fixed on the right.
 */
function Row(props: {
  level: 'pillar' | 'theme' | 'subtheme';
  open: boolean;
  onToggle?: () => void;
  tag: React.ReactNode;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  actions?: React.ReactNode;
  infoTooltip?: string;
}) {
  const { level, open, onToggle, tag, code, name, description, sortOrder, actions, infoTooltip } = props;

  const indent = level === 'pillar' ? '' : level === 'theme' ? 'pl-7' : 'pl-14';
  const CaretIcon = open ? ChevronDown : ChevronRight;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-start gap-3 px-4 py-3">
      {/* Caret + tag + name/code/description block, in a single left grid cell */}
      <div className={`col-span-2 flex min-w-0 items-start gap-2 ${indent}`}>
        {/* Caret (unchanged size) */}
        <button
          type="button"
          className={`mt-[2px] shrink-0 rounded p-1 hover:bg-gray-100 ${onToggle ? '' : 'opacity-0 pointer-events-none'}`}
          aria-label={onToggle ? (open ? 'Collapse' : 'Expand') : 'No children'}
          onClick={onToggle}
        >
          <CaretIcon className="h-4 w-4" />
        </button>

        {/* Tag */}
        <div className="mt-[2px] shrink-0">{tag}</div>

        {/* Name + inline code + description (description aligned under name) */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="truncate font-medium">{name}</div>
            <span className="truncate text-xs text-gray-500">{code}</span>

            {infoTooltip && (
              <Tooltip content={infoTooltip}>
                <ActionIcon aria-label="Info">
                  <Info className="h-3.5 w-3.5" />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
          {description && (
            <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">{description}</div>
          )}
        </div>
      </div>

      {/* Sort order (right aligned, fixed width) */}
      <div className="w-[64px] pr-2 text-right tabular-nums text-sm text-gray-700">{sortOrder}</div>

      {/* Actions (rightmost) */}
      <div className="w-[140px] pr-1 flex justify-end">{actions}</div>
    </div>
  );
}

function RightActions({
  title,
  onEdit,
}: {
  title: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content={title}>
        <ActionIcon aria-label={title} onClick={onEdit} disabled={!onEdit}>
          {/* Placeholder: you can swap in Edit/More icons later */}
          <Info className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
