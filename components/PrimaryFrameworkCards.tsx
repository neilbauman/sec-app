// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";

/** ---- Types (mirror your DB names; keep snake_case) ---- */
export type Pillar = {
  code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

export type Theme = {
  code: string;
  pillar_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

export type Subtheme = {
  code: string;
  theme_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null;
};

type Entity = "pillar" | "theme" | "subtheme";

type Actions = {
  updateName: (entity: Entity, code: string, name: string) => Promise<void>;
  updateDescription: (
    entity: Entity,
    code: string,
    description: string
  ) => Promise<void>;
  updateSort: (entity: Entity, code: string, sort: number) => Promise<void>;
  bumpSort: (entity: Entity, code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  /** Optional for now; pass to enable buttons. */
  actions?: Partial<Actions>;
};

/** ---- Small UI bits ---- */
function Caret({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-block h-4 w-4 transition-transform ${
        open ? "rotate-90" : "rotate-0"
      }`}
      aria-hidden
    >
      ▶
    </span>
  );
}

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "blue" | "green" | "red";
}) {
  const palette =
    color === "blue"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : color === "green"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-red-50 text-red-700 ring-red-200";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${palette}`}
    >
      {children}
    </span>
  );
}

function SmallCode({ code }: { code: string }) {
  return <span className="ml-2 text-[11px] font-normal text-slate-400">{code}</span>;
}

function NameBlock({
  tag,
  code,
  name,
  description,
  indent,
}: {
  tag: React.ReactNode;
  code: string;
  name: string | null;
  description: string | null;
  indent: number; // 0 pillar, 1 theme, 2 subtheme
}) {
  return (
    <div className={`flex min-w-0 items-start ${indent > 0 ? `pl-${indent * 6}` : ""}`}>
      {tag}
      <SmallCode code={code} />
      <div className="ml-3 min-w-0">
        <div className="truncate text-sm font-medium text-slate-900">
          {name ?? ""}
        </div>
        {description ? (
          <div className="mt-0.5 line-clamp-2 text-[13px] text-slate-600">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** ---- Main component ---- */
export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // Collapsible state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Group themes by pillar_code, subthemes by theme_code (consistent snake_case)
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    // Ensure deterministic order within group
    for (const k of Object.keys(map)) {
      map[k].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code)
      );
    }
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_code ?? "";
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    for (const k of Object.keys(map)) {
      map[k].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code)
      );
    }
    return map;
  }, [subthemes]);

  const sortedPillars = useMemo(() => {
    return (pillars ?? [])
      .slice()
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code)
      );
  }, [pillars]);

  // Safe no-op action helpers until wired
  const canAct = Boolean(actions);
  const call = async <K extends keyof Actions>(
    fn: K,
    ...args: Parameters<Actions[K]>
  ) => {
    if (!actions || !actions[fn]) return;
    // @ts-expect-error narrowing runtime
    await actions[fn]?.(...args);
  };

  const Row = ({
    left,
    sort,
    entity,
    code,
  }: {
    left: React.ReactNode;
    sort: number | null;
    entity: Entity;
    code: string;
  }) => (
    <div className="grid grid-cols-[1fr_96px_160px] items-center gap-4 border-b border-slate-200 px-4 py-3">
      <div className="min-w-0">{left}</div>

      {/* Sort column */}
      <div className="text-sm text-slate-700">{sort ?? 0}</div>

      {/* Actions column (disabled until wired) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`rounded-md border px-2 py-1 text-xs ${
            canAct
              ? "border-slate-300 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-200 text-slate-300"
          }`}
          onClick={() => call("bumpSort", entity, code, -1)}
          disabled={!canAct}
          title="Move up"
        >
          ▲
        </button>
        <button
          type="button"
          className={`rounded-md border px-2 py-1 text-xs ${
            canAct
              ? "border-slate-300 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-200 text-slate-300"
          }`}
          onClick={() => call("bumpSort", entity, code, +1)}
          disabled={!canAct}
          title="Move down"
        >
          ▼
        </button>
        <button
          type="button"
          className={`rounded-md border px-2 py-1 text-xs ${
            canAct
              ? "border-slate-300 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-200 text-slate-300"
          }`}
          onClick={() => {
            /* future: open inline editor */
          }}
          disabled={!canAct}
          title="Edit"
        >
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_96px_160px] items-center gap-4 border-b border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        <div>Name / Description</div>
        <div>Sort Order</div>
        <div>Actions</div>
      </div>

      {/* Rows */}
      <div>
        {sortedPillars.map((p) => {
          const pOpen = openPillars[p.code] ?? defaultOpen;
          const pThemes = themesByPillar[p.code] ?? [];

          return (
            <div key={p.code} className="border-b border-slate-200">
              <Row
                left={
                  <button
                    type="button"
                    className="flex w-full items-start gap-2 text-left"
                    onClick={() =>
                      setOpenPillars((s) => ({ ...s, [p.code]: !pOpen }))
                    }
                    aria-expanded={pOpen}
                  >
                    <Caret open={pOpen} />
                    <NameBlock
                      tag={<Tag color="blue">Pillar</Tag>}
                      code={p.code}
                      name={p.name}
                      description={p.description}
                      indent={0}
                    />
                  </button>
                }
                sort={p.sort_order}
                entity="pillar"
                code={p.code}
              />

              {/* Themes under this pillar */}
              {pOpen &&
                pThemes.map((t) => {
                  const tOpen = openThemes[t.code] ?? defaultOpen;
                  const tSubs = subthemesByTheme[t.code] ?? [];

                  return (
                    <div key={t.code}>
                      <Row
                        left={
                          <button
                            type="button"
                            className="flex w-full items-start gap-2 text-left"
                            onClick={() =>
                              setOpenThemes((s) => ({ ...s, [t.code]: !tOpen }))
                            }
                            aria-expanded={tOpen}
                          >
                            <Caret open={tOpen} />
                            <NameBlock
                              tag={<Tag color="green">Theme</Tag>}
                              code={t.code}
                              name={t.name}
                              description={t.description}
                              indent={1}
                            />
                          </button>
                        }
                        sort={t.sort_order}
                        entity="theme"
                        code={t.code}
                      />

                      {/* Subthemes belong directly under their theme */}
                      {tOpen &&
                        tSubs.map((s) => (
                          <Row
                            key={s.code}
                            left={
                              <div className="flex items-start gap-2">
                                {/* subthemes are not collapsible here */}
                                <span className="inline-block h-4 w-4 opacity-0">
                                  ▶
                                </span>
                                <NameBlock
                                  tag={<Tag color="red">Subtheme</Tag>}
                                  code={s.code}
                                  name={s.name}
                                  description={s.description}
                                  indent={2}
                                />
                              </div>
                            }
                            sort={s.sort_order}
                            entity="subtheme"
                            code={s.code}
                          />
                        ))}
                    </div>
                  );
                })}
            </div>
          );
        })}

        {/* Empty state */}
        {sortedPillars.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No pillars found.
          </div>
        )}
      </div>
    </section>
  );
}
