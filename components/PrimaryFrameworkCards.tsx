// components/PrimaryFrameworkCards.tsx
"use client";
import * as React from "react";
import { ChevronRight, ChevronDown, Info, Download, Upload } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import {
  cn,
  Card,
  CardHeader,
  CardBody,
  Tag,
  CodeChip,
  ActionIcon,
  Tooltip,
  SortIcon,
} from "@/lib/ui";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // read-only for now; but keep action slots API
  actions?: {
    onImportPillarCsv?: () => void;
    onExportPillarCsv?: () => void;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
}: Props) {
  /** track expansion by id */
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const p of pillars) init[`p-${p.id}`] = !!defaultOpen;
    for (const t of themes) init[`t-${t.id}`] = !!defaultOpen;
    return init;
  });
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  /** group themes and subthemes */
  const themesByPillar = new Map<number, Theme[]>();
  for (const t of themes) {
    if (!t.pillar_id) continue;
    const arr = themesByPillar.get(t.pillar_id) ?? [];
    arr.push(t);
    themesByPillar.set(t.pillar_id, arr);
  }
  const subthemesByTheme = new Map<number, Subtheme[]>();
  for (const s of subthemes) {
    if (!s.theme_id) continue;
    const arr = subthemesByTheme.get(s.theme_id) ?? [];
    arr.push(s);
    subthemesByTheme.set(s.theme_id, arr);
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SortIcon />
          <span className="text-sm text-gray-600">Sort order</span>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Import Pillars (CSV)">
            <ActionIcon aria-label="Import CSV">
              <Upload className="h-4 w-4" />
            </ActionIcon>
          </Tooltip>
          <Tooltip content="Export Pillars (CSV)">
            <ActionIcon aria-label="Export CSV">
              <Download className="h-4 w-4" />
            </ActionIcon>
          </Tooltip>
        </div>
      </CardHeader>

      <CardBody className="space-y-2">
        {/* Pillars */}
        {pillars.map((pillar) => {
          const pKey = `p-${pillar.id}`;
          const pOpen = !!open[pKey];
          const pillarThemes = (themesByPillar.get(pillar.id) ?? []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          );

          return (
            <div key={pillar.id} className="rounded-lg border">
              <Row
                level="pillar"
                open={pOpen}
                onToggle={() => toggle(pKey)}
                tag={<Tag color="blue">Pillar</Tag>}
                code={pillar.code}
                name={pillar.name}
                description={pillar.description ?? ""}
                actionsSlot={
                  <Tooltip content="About pillar">
                    <ActionIcon aria-label="Info">
                      <Info className="h-4 w-4" />
                    </ActionIcon>
                  </Tooltip>
                }
              />

              {/* Themes */}
              {pOpen && pillarThemes.length > 0 && (
                <div className="space-y-1 pb-1 pl-6 pt-1">
                  {pillarThemes.map((theme) => {
                    const tKey = `t-${theme.id}`;
                    const tOpen = !!open[tKey];
                    const themeSubs = (subthemesByTheme.get(theme.id) ?? []).sort(
                      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                    );

                    return (
                      <div key={theme.id} className="rounded-md border">
                        <Row
                          level="theme"
                          open={tOpen}
                          onToggle={() => toggle(tKey)}
                          tag={<Tag color="green">Theme</Tag>}
                          code={theme.code}
                          name={theme.name}
                          description={theme.description ?? ""}
                          actionsSlot={
                            <Tooltip content="About theme">
                              <ActionIcon aria-label="Info">
                                <Info className="h-4 w-4" />
                              </ActionIcon>
                            </Tooltip>
                          }
                        />

                        {/* Subthemes */}
                        {tOpen && themeSubs.length > 0 && (
                          <div className="space-y-1 pb-1 pl-6 pt-1">
                            {themeSubs.map((sub) => (
                              <div key={sub.id} className="rounded-md border">
                                <Row
                                  level="subtheme"
                                  open={false}
                                  onToggle={() => {}}
                                  isLeaf
                                  tag={<Tag color="red">Subtheme</Tag>}
                                  code={sub.code}
                                  name={sub.name}
                                  description={sub.description ?? ""}
                                  actionsSlot={
                                    <Tooltip content="About subtheme">
                                      <ActionIcon aria-label="Info">
                                        <Info className="h-4 w-4" />
                                      </ActionIcon>
                                    </Tooltip>
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}

/** One row in the hierarchy list */
function Row({
  level,
  open,
  onToggle,
  isLeaf = false,
  tag,
  code,
  name,
  description,
  actionsSlot,
}: {
  level: "pillar" | "theme" | "subtheme";
  open: boolean;
  onToggle: () => void;
  isLeaf?: boolean;
  tag: React.ReactNode;
  code: string | null | undefined;
  name: string;
  description: string;
  actionsSlot?: React.ReactNode;
}) {
  const Caret = open ? ChevronDown : ChevronRight;

  return (
    <div className="flex items-start gap-3 px-3 py-2">
      {/* Caret (tiny and unchanged) */}
      <button
        type="button"
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50",
          { "opacity-0 pointer-events-none": isLeaf }
        )}
        onClick={isLeaf ? undefined : onToggle}
        aria-label={open ? "Collapse" : "Expand"}
      >
        {!isLeaf ? <Caret className="h-3.5 w-3.5 text-gray-500" /> : null}
      </button>

      {/* Tag + code chip */}
      <div className="min-w-[130px] pt-0.5">
        <div className="flex items-center">
          {tag}
          {code ? <CodeChip>{code}</CodeChip> : null}
        </div>
      </div>

      {/* Name + description (description aligns with left edge of NAME) */}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{name}</div>
        {description ? (
          <div className="text-sm text-gray-600">{description}</div>
        ) : null}
      </div>

      {/* Right-aligned actions */}
      <div className="ml-auto">
        <div className="flex items-center gap-1">{actionsSlot}</div>
      </div>
    </div>
  );
}
