// components/PrimaryFrameworkCards.tsx
import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

// If you already have HierarchyTag in lib/ui, we'll use it; otherwise fallback.
let ExternalHierarchyTag: React.FC<{ level: "pillar" | "theme" | "subtheme" }> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExternalHierarchyTag = require("@/lib/ui").HierarchyTag;
} catch { /* optional dependency */ }

type PillarLike = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
};

type ThemeLike = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  pillar_id?: string | null;
  pillar_code?: string | null;
};

type SubthemeLike = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  theme_id?: string | null;
  theme_code?: string | null;
};

export type PrimaryFrameworkCardsProps = {
  defaultOpen?: boolean;
  pillars: PillarLike[];
  themes: ThemeLike[];
  subthemes: SubthemeLike[];
  // Optional action handlers (all are placeholders—wire up later)
  actions?: {
    addTheme?(pillar: PillarLike): void;
    editPillar?(pillar: PillarLike): void;
    deletePillar?(pillar: PillarLike): void;

    addSubtheme?(theme: ThemeLike): void;
    editTheme?(theme: ThemeLike): void;
    deleteTheme?(theme: ThemeLike): void;

    editSubtheme?(subtheme: SubthemeLike): void;
    deleteSubtheme?(subtheme: SubthemeLike): void;
  };
};

const FallbackHierarchyTag: React.FC<{ level: "pillar" | "theme" | "subtheme" }> = ({ level }) => {
  const map = {
    pillar: "bg-blue-100 text-blue-700 ring-blue-200",
    theme: "bg-green-100 text-green-700 ring-green-200",
    subtheme: "bg-red-100 text-red-700 ring-red-200",
  } as const;

  const label = level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme";
  const cls = map[level];

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ring-1 ${cls}`}>
      {label}
    </span>
  );
};

const HierarchyTag: React.FC<{ level: "pillar" | "theme" | "subtheme" }> =
  ExternalHierarchyTag ?? FallbackHierarchyTag;

// Reusable row shell (3 fixed columns: Name/Description | Sort | Actions)
function RowShell({
  children,
  sort,
  actions,
}: {
  children: React.ReactNode;
  sort: number | string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr,80px,120px] items-start gap-2 px-4 py-3">
      <div className="min-w-0">{children}</div>
      <div className="self-center text-sm tabular-nums text-gray-500">{sort}</div>
      <div className="flex items-center justify-end gap-2">{actions}</div>
    </div>
  );
}

// Inline set of icon buttons (right-aligned in the row)
function ActionIcon({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100"
    >
      {children}
    </button>
  );
}

// A compact inline left block: Tag + small gray code, next to a name+description stack
function NameBlock({
  level,
  code,
  name,
  description,
}: {
  level: "pillar" | "theme" | "subtheme";
  code: string;
  name: string;
  description?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Left inline chunk: Tag + Code */}
      <div className="mt-0.5 flex shrink-0 items-center gap-2">
        <HierarchyTag level={level} />
        <span className="text-[11px] leading-none text-gray-500">{code}</span>
      </div>
      {/* Right stack: Name (bold), Description under the name (aligned with the name, not the tag) */}
      <div className="min-w-0">
        <div className="truncate font-medium text-gray-900">{name}</div>
        {description ? (
          <div className="mt-1 text-sm leading-relaxed text-gray-600">{description}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: PrimaryFrameworkCardsProps) {
  // Group helpers
  const themesByPillar = React.useMemo(() => {
    const map = new Map<string, ThemeLike[]>();
    for (const t of themes) {
      const key = (t.pillar_id ?? "") || (t.pillar_code ?? "");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    // stable sort by sort_order
    for (const [, arr] of map) arr.sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [themes]);

  const subsByTheme = React.useMemo(() => {
    const map = new Map<string, SubthemeLike[]>();
    for (const s of subthemes) {
      const key = (s.theme_id ?? "") || (s.theme_code ?? "");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    for (const [, arr] of map) arr.sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [subthemes]);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header row (static) */}
      <div className="grid grid-cols-[1fr,80px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-center">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Pillars */}
      <div>
        {pillars
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => {
            const pillarKey = p.id ?? p.code;
            const pillarThemes =
              themesByPillar.get(pillarKey) ??
              themesByPillar.get(p.code) ??
              [];

            return (
              <details key={pillarKey} className="group border-b border-gray-100" {...(defaultOpen ? { open: true } : {})}>
                <summary className="list-none cursor-pointer select-none">
                  <RowShell
                    sort={p.sort_order}
                    actions={
                      <>
                        <ActionIcon title="Add theme" onClick={() => actions?.addTheme?.(p)}>
                          <Plus size={16} />
                        </ActionIcon>
                        <ActionIcon title="Edit pillar" onClick={() => actions?.editPillar?.(p)}>
                          <Pencil size={16} />
                        </ActionIcon>
                        <ActionIcon title="Delete pillar" onClick={() => actions?.deletePillar?.(p)}>
                          <Trash2 size={16} />
                        </ActionIcon>
                      </>
                    }
                  >
                    <NameBlock
                      level="pillar"
                      code={p.code}
                      name={p.name}
                      description={p.description ?? ""}
                    />
                  </RowShell>
                </summary>

                {/* Themes under the pillar */}
                {pillarThemes.length > 0 && (
                  <div className="bg-white">
                    {pillarThemes.map((t) => {
                      const themeKey = t.id ?? t.code;
                      const childSubs =
                        subsByTheme.get(themeKey) ??
                        subsByTheme.get(t.code) ??
                        [];

                      return (
                        <details key={themeKey} className="group border-t border-gray-100 bg-white pl-6">
                          <summary className="list-none cursor-pointer select-none">
                            <RowShell
                              sort={t.sort_order}
                              actions={
                                <>
                                  <ActionIcon title="Add subtheme" onClick={() => actions?.addSubtheme?.(t)}>
                                    <Plus size={16} />
                                  </ActionIcon>
                                  <ActionIcon title="Edit theme" onClick={() => actions?.editTheme?.(t)}>
                                    <Pencil size={16} />
                                  </ActionIcon>
                                  <ActionIcon title="Delete theme" onClick={() => actions?.deleteTheme?.(t)}>
                                    <Trash2 size={16} />
                                  </ActionIcon>
                                </>
                              }
                            >
                              <NameBlock
                                level="theme"
                                code={t.code}
                                name={t.name}
                                description={t.description ?? ""}
                              />
                            </RowShell>
                          </summary>

                          {/* Subthemes */}
                          {childSubs.length > 0 && (
                            <div className="bg-white pl-6">
                              {childSubs.map((s) => {
                                const subKey = s.id ?? s.code;
                                return (
                                  <div key={subKey} className="border-t border-gray-100">
                                    <RowShell
                                      sort={s.sort_order}
                                      actions={
                                        <>
                                          <ActionIcon title="Edit subtheme" onClick={() => actions?.editSubtheme?.(s)}>
                                            <Pencil size={16} />
                                          </ActionIcon>
                                          <ActionIcon title="Delete subtheme" onClick={() => actions?.deleteSubtheme?.(s)}>
                                            <Trash2 size={16} />
                                          </ActionIcon>
                                        </>
                                      }
                                    >
                                      <NameBlock
                                        level="subtheme"
                                        code={s.code}
                                        name={s.name}
                                        description={s.description ?? ""}
                                      />
                                    </RowShell>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </details>
                      );
                    })}
                  </div>
                )}
              </details>
            );
          })}
      </div>
    </section>
  );
}
