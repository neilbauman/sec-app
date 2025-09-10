'use client';

import React from 'react';
import type { Pillar, Theme, Subtheme } from '@/types/framework';
import { ChevronRight, ChevronDown, Info, Pencil, Plus, Trash2 } from 'lucide-react';
import { Tag, Tooltip, ActionIcon } from '@/lib/ui';

type Data = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

type Props = {
  data: Data;
  /** Open all accordions by default (useful during authoring) */
  defaultOpen?: boolean;
};

/** Small disclosure caret that stays 16px and does not affect row height */
function Caret({
  open,
  onToggle,
  'aria-label': ariaLabel,
}: {
  open: boolean;
  onToggle: () => void;
  'aria-label'?: string;
}) {
  const Icon = open ? ChevronDown : ChevronRight;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onToggle}
      className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100 focus-visible:outline-none"
    >
      <Icon className="h-4 w-4 text-gray-600" strokeWidth={2} />
    </button>
  );
}

/** Row layout: caret | tag | code | [name + description stacked] | actions */
function Row({
  level,
  open,
  onToggle,
  tagColor,
  tagText,
  code,
  name,
  description,
  rightActions,
  indentPx = 0,
}: {
  level: 'pillar' | 'theme' | 'subtheme';
  open?: boolean;
  onToggle?: () => void;
  tagColor: 'blue' | 'green' | 'red';
  tagText: string;
  code?: string | null;
  name: string;
  description?: string | null;
  rightActions?: React.ReactNode;
  indentPx?: number;
}) {
  const showCaret = typeof open === 'boolean' && typeof onToggle === 'function';

  return (
    <div
      className="grid grid-cols-[auto_auto_auto_1fr_auto] items-start gap-2 border-b border-gray-100 py-2"
      style={{ paddingLeft: indentPx }}
    >
      {/* caret */}
      <div className="pt-1">
        {showCaret ? (
          <Caret open={!!open} onToggle={onToggle!} aria-label={`Toggle ${level}`} />
        ) : (
          <div className="h-6 w-6" />
        )}
      </div>

      {/* tag (color-coded) */}
      <div className="pt-1">
        <Tag color={tagColor}>{tagText}</Tag>
      </div>

      {/* code (small, gray, right of tag) */}
      <div className="pt-1">
        {code ? <span className="text-xs text-gray-500">{code}</span> : <span className="text-xs text-transparent">—</span>}
      </div>

      {/* name + description (aligned left together) */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="truncate font-medium text-gray-900">{name}</div>
          {description ? (
            <Tooltip content={description}>
              <Info className="h-4 w-4 shrink-0 text-gray-400" />
            </Tooltip>
          ) : null}
        </div>
        {description ? (
          <div className="mt-1 line-clamp-2 text-sm leading-snug text-gray-600">{description}</div>
        ) : null}
      </div>

      {/* actions on the far right */}
      <div className="flex items-center justify-end gap-1">
        {rightActions}
      </div>
    </div>
  );
}

export default function PrimaryFrameworkCards({ data, defaultOpen = true }: Props) {
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!defaultOpen) return;
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    for (const pillar of data.pillars) p[pillar.id] = true;
    for (const theme of data.themes) t[theme.id] = true;
    setOpenPillars(p);
    setOpenThemes(t);
  }, [data.pillars, data.themes, defaultOpen]);

  const themesByPillar = React.useMemo(() => {
    const map = new Map<string, Theme[]>();
    for (const theme of data.themes) {
      const key = theme.pillar_id ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(theme);
    }
    // maintain incoming order
    return map;
  }, [data.themes]);

  const subthemesByTheme = React.useMemo(() => {
    const map = new Map<string, Subtheme[]>();
    for (const s of data.subthemes) {
      const key = s.theme_id ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [data.subthemes]);

  const togglePillar = (id: string) => setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) => setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header row labels */}
      <div className="grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-2 border-b border-gray-200 bg-gray-50/70 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <div className="h-4 w-6" />
        <div>Type</div>
        <div>Code</div>
        <div>Name & description</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Pillars */}
      <div>
        {data.pillars.map((pillar) => {
          const pOpen = !!openPillars[pillar.id];
          const themes = themesByPillar.get(pillar.id) ?? [];

          return (
            <div key={pillar.id}>
              <Row
                level="pillar"
                open={true /* pillar rows always show carets */}
                onToggle={() => togglePillar(pillar.id)}
                tagColor="blue"
                tagText="Pillar"
                code={pillar.code}
                name={pillar.name}
                description={pillar.description ?? ''}
                rightActions={
                  <>
                    <Tooltip content="Edit pillar">
                      <ActionIcon ariaLabel="Edit pillar">
                        <Pencil className="h-4 w-4" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip content="Add theme">
                      <ActionIcon ariaLabel="Add theme">
                        <Plus className="h-4 w-4" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip content="Delete pillar">
                      <ActionIcon ariaLabel="Delete pillar">
                        <Trash2 className="h-4 w-4" />
                      </ActionIcon>
                    </Tooltip>
                  </>
                }
              />

              {/* Themes under pillar */}
              {pOpen &&
                themes.map((theme) => {
                  const tOpen = !!openThemes[theme.id];
                  const subs = subthemesByTheme.get(theme.id) ?? [];

                  return (
                    <div key={theme.id}>
                      <Row
                        level="theme"
                        open={true}
                        onToggle={() => toggleTheme(theme.id)}
                        tagColor="green"
                        tagText="Theme"
                        code={theme.code}
                        name={theme.name}
                        description={theme.description ?? ''}
                        indentPx={24 /* indent child level slightly */}
                        rightActions={
                          <>
                            <Tooltip content="Edit theme">
                              <ActionIcon ariaLabel="Edit theme">
                                <Pencil className="h-4 w-4" />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip content="Add subtheme">
                              <ActionIcon ariaLabel="Add subtheme">
                                <Plus className="h-4 w-4" />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip content="Delete theme">
                              <ActionIcon ariaLabel="Delete theme">
                                <Trash2 className="h-4 w-4" />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        }
                      />

                      {/* Subthemes under theme */}
                      {tOpen &&
                        subs.map((sub) => (
                          <Row
                            key={sub.id}
                            level="subtheme"
                            tagColor="red"
                            tagText="Subtheme"
                            code={sub.code}
                            name={sub.name}
                            description={sub.description ?? ''}
                            indentPx={48}
                            rightActions={
                              <>
                                <Tooltip content="Edit subtheme">
                                  <ActionIcon ariaLabel="Edit subtheme">
                                    <Pencil className="h-4 w-4" />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip content="Delete subtheme">
                                  <ActionIcon ariaLabel="Delete subtheme">
                                    <Trash2 className="h-4 w-4" />
                                  </ActionIcon>
                                </Tooltip>
                              </>
                            }
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
