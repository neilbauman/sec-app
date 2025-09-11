// components/PrimaryFrameworkCards.tsx
import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronRight, ChevronDown, Info } from "lucide-react";
import { cn, Tooltip, ActionIcon, Tag } from "@/lib/ui";

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

type OpenMap = Record<string, boolean>;

function useOpenMap(defaultOpen = false) {
  const [open, setOpen] = useState<OpenMap>({});
  const isOpen = (key: string) => open[key] ?? defaultOpen;
  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !(prev[key] ?? defaultOpen) }));
  return { isOpen, toggle };
}

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
      className={[
        "inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50",
        isLeaf ? "opacity-0 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={isLeaf ? undefined : onToggle}
      aria-label={open ? "Collapse" : "Expand"}
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
  caret,
  tag,
  code,
  name,
  description,
  sortOrder,
  actions,
}: {
  caret?: React.ReactNode;
  tag: React.ReactNode;
  code?: string;
  name: string;
  description?: string;
  sortOrder?: number | null;
  actions?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.75rem,auto,5rem,1fr,4rem,auto] items-start gap-3 px-3 py-2 hover:bg-gray-50">
      {/* caret */}
      <div className="pt-0.5">{caret}</div>

      {/* tag + name with code to the right */}
      <div className="flex min-w-0 items-center gap-2">
        {tag}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium text-gray-900">{name}</div>
            {code ? (
              <div className="shrink-0 text-xs text-gray-500">{code}</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* sort order */}
      <div className="text-sm tabular-nums text-gray-600">
        {sortOrder ?? ""}
      </div>

      {/* description — aligned with name column’s left edge */}
      <div className="min-w-0 text-sm text-gray-600">{description ?? ""}</div>

      {/* info icon */}
      <div className="pt-0.5">
        <Tooltip content="Info / help">
          <ActionIcon aria-label="Info">
            <Info className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </div>

      {/* actions on far right */}
      <div className="flex justify-end">{actions}</div>
    </div>
  );
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // Build lookups
  const themesByPillar = useMemo(() => {
    const map = new Map<number, Theme[]>();
    for (const t of themes) {
      if (!t.pillar_id) continue;
      const arr = map.get(t.pillar_id) ?? [];
      arr.push(t);
      map.set(t.pillar_id, arr);
    }
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map = new Map<number, Subtheme[]>();
    for (const s of subthemes) {
      if (!s.theme_id) continue;
      const arr = map.get(s.theme_id) ?? [];
      arr.push(s);
      map.set(s.theme_id, arr);
    }
    return map;
  }, [subthemes]);

  const { isOpen: isPillarOpen, toggle: togglePillar } = useOpenMap(defaultOpen);
  const { isOpen: isThemeOpen, toggle: toggleTheme } = useOpenMap(defaultOpen);

  return (
    <Card>
      {/* header row */}
      <div className="grid grid-cols-[1.75rem,auto,5rem,1fr,4rem,auto] items-center gap-3 border-b bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <div />
        <div className="pl-0.5">Hierarchy</div>
        <div>Sort</div>
        <div>Description</div>
        <div>Info</div>
        <div className="text-right">Actions</div>
      </div>

      {/* content */}
      <div>
        {pillars.map((pillar) => {
          const pKey = `p-${pillar.id}`;
          const pOpen = isPillarOpen(pKey);
          const pillarThemes = (themesByPillar.get(pillar.id) ?? []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          );

          return (
            <div key={pKey} className="border-b">
              <Row
                caret={
                  <Caret open={pOpen} onToggle={() => togglePillar(pKey)} />
                }
                tag={<Tag color="blue">Pillar</Tag>}
                code={pillar.code}
                name={pillar.name}
                description={pillar.description ?? ""}
                sortOrder={pillar.sort_order ?? null}
                actions={
                  actions?.onEditPillar ? (
                    <button
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                      onClick={() => actions.onEditPillar?.(pillar)}
                    >
                      Edit
                    </button>
                  ) : null
                }
              />

              {pOpen &&
                pillarThemes.map((theme) => {
                  const tKey = `t-${theme.id}`;
                  const tOpen = isThemeOpen(tKey);
                  const themeSubthemes = (subthemesByTheme.get(theme.id) ??
                    []
                  ).sort(
                    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                  );

                  return (
                    <div key={tKey}>
                      <Row
                        caret={
                          <Caret
                            open={tOpen}
                            onToggle={() => toggleTheme(tKey)}
                          />
                        }
                        tag={<Tag color="green">Theme</Tag>}
                        code={theme.code}
                        name={theme.name}
                        description={theme.description ?? ""}
                        sortOrder={theme.sort_order ?? null}
                        actions={
                          actions?.onEditTheme ? (
                            <button
                              className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                              onClick={() => actions.onEditTheme?.(theme)}
                            >
                              Edit
                            </button>
                          ) : null
                        }
                      />

                      {tOpen &&
                        themeSubthemes.map((sub) => (
                          <Row
                            key={`s-${sub.id}`}
                            caret={<Caret open={false} isLeaf />}
                            tag={<Tag color="red">Subtheme</Tag>}
                            code={sub.code}
                            name={sub.name}
                            description={sub.description ?? ""}
                            sortOrder={sub.sort_order ?? null}
                            actions={
                              actions?.onEditSubtheme ? (
                                <button
                                  className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                                  onClick={() => actions.onEditSubtheme?.(sub)}
                                >
                                  Edit
                                </button>
                              ) : null
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
    </Card>
  );
}
