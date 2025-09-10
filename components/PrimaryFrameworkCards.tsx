"use client";

import React from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Info } from "lucide-react";
import { Card, Tooltip, ActionIcon, Tag } from "@/lib/ui";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // Optional row-level actions the page can pass in later (edit/delete etc.)
  actions?: {
    onPillarEdit?: (p: Pillar) => void;
    onThemeEdit?: (t: Theme) => void;
    onSubthemeEdit?: (s: Subtheme) => void;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  // Open all by default only once on mount (if requested)
  React.useEffect(() => {
    if (!defaultOpen) return;
    const next: Record<string, boolean> = {};
    for (const p of pillars) next[`pillar:${p.id}`] = true;
    for (const t of themes) next[`theme:${t.id}`] = true;
    setOpenMap(next);
  }, [defaultOpen, pillars, themes]);

  const toggle = (key: string) =>
    setOpenMap((m) => ({ ...m, [key]: !m[key] }));

  const themeByPillar = React.useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      const k = String(t.pillar_id ?? "");
      (map[k] ||= []).push(t);
    }
    for (const k in map) map[k].sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [themes]);

  const subthemesByTheme = React.useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const k = String(s.theme_id ?? "");
      (map[k] ||= []).push(s);
    }
    for (const k in map) map[k].sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [subthemes]);

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-right">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y">
        {pillars
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((pillar) => {
            const pKey = `pillar:${pillar.id}`;
            const pOpen = !!openMap[pKey];
            const pillarThemes = themeByPillar[String(pillar.id)] ?? [];

            return (
              <React.Fragment key={pillar.id}>
                <Row
                  level="pillar"
                  open={pOpen}
                  onToggle={() => toggle(pKey)}
                  tag={<Tag.Pillar>Pillar</Tag.Pillar>}
                  code={pillar.code}
                  name={pillar.name}
                  description={pillar.description ?? ""}
                  sortOrder={pillar.sort_order}
                  actions={
                    <RowActions
                      onEdit={
                        actions?.onPillarEdit
                          ? () => actions.onPillarEdit!(pillar)
                          : undefined
                      }
                    />
                  }
                />

                {pOpen &&
                  pillarThemes.map((theme) => {
                    const tKey = `theme:${theme.id}`;
                    const tOpen = !!openMap[tKey];
                    const themeSubs = subthemesByTheme[String(theme.id)] ?? [];

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
                        actions={
                          <RowActions
                            onEdit={
                              actions?.onThemeEdit
                                ? () => actions.onThemeEdit!(theme)
                                : undefined
                            }
                          />
                        }
                        childrenContent={
                          tOpen &&
                          themeSubs.map((st) => (
                            <Row
                              key={st.id}
                              level="subtheme"
                              open={false}
                              // subthemes don’t expand (no caret)
                              onToggle={undefined}
                              tag={<Tag.Subtheme>Subtheme</Tag.Subtheme>}
                              code={st.code}
                              name={st.name}
                              description={st.description ?? ""}
                              sortOrder={st.sort_order}
                              actions={
                                <RowActions
                                  onEdit={
                                    actions?.onSubthemeEdit
                                      ? () => actions.onSubthemeEdit!(st)
                                      : undefined
                                  }
                                />
                              }
                            />
                          ))
                        }
                      />
                    );
                  })}
              </React.Fragment>
            );
          })}
      </div>
    </Card>
  );
}

/** A single “row” that can represent pillar/theme/subtheme.
 * Layout:
 *  - 1st column is a 2-col grid: [caret+tag+code]   [name + description (aligned under name)]
 *  - 2nd column = sort (right-aligned)
 *  - 3rd column = actions (right-aligned)
 */
function Row(props: {
  level: "pillar" | "theme" | "subtheme";
  open: boolean;
  onToggle?: () => void; // undefined => render w/o caret (subtheme)
  tag: React.ReactNode;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  actions?: React.ReactNode;
  childrenContent?: React.ReactNode;
}) {
  const { level, open, onToggle, tag, code, name, description, sortOrder, actions, childrenContent } =
    props;

  const caret = onToggle ? (
    <button
      onClick={onToggle}
      className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
      aria-label={open ? "Collapse" : "Expand"}
    >
      {open ? (
        <ChevronDown className="h-4 w-4 text-gray-600" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-600" />
      )}
    </button>
  ) : (
    // reserve the same width so text lines up even without caret
    <span className="inline-flex h-5 w-5" aria-hidden />
  );

  return (
    <>
      <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
        {/* First column: two sub-columns so the description can align with the name, not under the tag */}
        <div className="grid grid-cols-[auto,1fr] items-start gap-3">
          {/* left mini column: caret + tag + code (small, gray) */}
          <div className="flex items-center gap-2">
            {caret}
            <div className="flex items-center gap-2">
              {tag}
              <span className="text-xs text-gray-500">{code}</span>
            </div>
          </div>

          {/* right mini column: name + description (description is aligned with the left of name) */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate font-medium text-gray-900">{name}</div>
              <Tooltip content="Info about this item">
                <ActionIcon ariaLabel="Info">
                  <Info className="h-4 w-4" />
                </ActionIcon>
              </Tooltip>
            </div>
            {description ? (
              <div className="mt-0.5 text-sm text-gray-600">{description}</div>
            ) : null}
          </div>
        </div>

        {/* Sort (right aligned) */}
        <div className="pt-0.5 text-right tabular-nums text-gray-700">{sortOrder}</div>

        {/* Actions (right aligned) */}
        <div className="flex items-center justify-end gap-2">{actions}</div>
      </div>

      {/* Children */}
      {open && childrenContent}
    </>
  );
}

function RowActions({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit ? (
        <Tooltip content="Edit">
          <ActionIcon ariaLabel="Edit" onClick={onEdit} />
        </Tooltip>
      ) : null}
    </div>
  );
}
