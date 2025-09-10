// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Action signatures the server page passes down
export type FrameworkActions = {
  updateName: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void>;
  updateDescription: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void>;
  updateSort: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void>;
  bumpSort: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions: FrameworkActions;
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Index themes and subthemes by parent
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      const key = (t as any).pillar_code ?? t.pillarCode ?? t.pillar ?? t.parent_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    return m;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const key = (s as any).theme_code ?? s.themeCode ?? s.theme ?? s.parent_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    return m;
  }, [subthemes]);

  const togglePillar = (code: string) =>
    setOpenPillars((p) => ({ ...p, [code]: !(p[code] ?? defaultOpen) }));

  const toggleTheme = (code: string) =>
    setOpenThemes((p) => ({ ...p, [code]: !(p[code] ?? defaultOpen) }));

  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      aria-hidden
      className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );

  const RowShell = ({
    level,
    tag,
    tagClass,
    code,
    name,
    description,
    sort,
    onBump,
    onSaveName,
    onSaveDesc,
    onSaveSort,
    caret,
  }: {
    level: 0 | 1 | 2;
    tag: string;
    tagClass: string;
    code: string;
    name: string;
    description: string | null | undefined;
    sort: number | null | undefined;
    onBump?: (delta: number) => void;
    onSaveName?: (v: string) => void;
    onSaveDesc?: (v: string) => void;
    onSaveSort?: (v: number) => void;
    caret?: React.ReactNode;
  }) => {
    const indent = level === 0 ? "" : level === 1 ? "pl-6" : "pl-12";
    return (
      <div className="grid grid-cols-[1fr,110px,120px] gap-3 border-b bg-white">
        <div className={`flex items-start gap-2 px-4 py-3 ${indent}`}>
          <div className="mt-1 text-slate-500">{caret}</div>
          <span
            className={`h-6 shrink-0 rounded-full px-2 text-xs font-medium leading-6 ${tagClass}`}
          >
            {tag}
          </span>
          <span className="self-center text-[11px] font-semibold text-slate-400">[{code}]</span>
          <div className="min-w-0">
            <input
              defaultValue={name}
              onBlur={(e) => onSaveName?.(e.currentTarget.value)}
              className="w-full truncate bg-transparent text-sm font-medium outline-none"
              aria-label={`${tag} name`}
            />
            <textarea
              defaultValue={description ?? ""}
              onBlur={(e) => onSaveDesc?.(e.currentTarget.value)}
              className="w-full resize-none bg-transparent text-[13px] leading-snug text-slate-600 outline-none"
              rows={1}
              aria-label={`${tag} description`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => onBump?.(-1)}
            disabled={isPending}
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => onBump?.(1)}
            disabled={isPending}
            title="Move down"
          >
            ↓
          </button>
          <input
            type="number"
            defaultValue={sort ?? 0}
            onBlur={(e) => onSaveSort?.(Number(e.currentTarget.value))}
            className="w-14 rounded border px-1 py-1 text-xs"
            aria-label={`${tag} sort`}
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
            disabled
            title="Edit (coming soon)"
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
            disabled
            title="Delete (coming soon)"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* header */}
      <div className="grid grid-cols-[1fr,110px,120px] items-center gap-3 border-b bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <div>Name / Description</div>
        <div className="pl-2">Sort</div>
        <div className="pl-2">Actions</div>
      </div>

      {/* rows */}
      <div>
        {pillars
          .slice()
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((p) => {
            const pOpen = openPillars[p.code] ?? defaultOpen;
            const pillarCaret = (
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600"
                onClick={() => togglePillar(p.code)}
                aria-label={pOpen ? "Collapse pillar" : "Expand pillar"}
              >
                <Chevron open={pOpen} />
              </button>
            );

            const handlePillar = {
              onBump: (delta: number) =>
                startTransition(() => actions.bumpSort("pillar", p.code, delta)),
              onSaveName: (v: string) =>
                startTransition(() => actions.updateName("pillar", p.code, v)),
              onSaveDesc: (v: string) =>
                startTransition(() => actions.updateDescription("pillar", p.code, v)),
              onSaveSort: (v: number) =>
                startTransition(() => actions.updateSort("pillar", p.code, v)),
            };

            return (
              <div key={p.code}>
                <RowShell
                  level={0}
                  tag="Pillar"
                  tagClass="bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  code={p.code}
                  name={p.name}
                  description={p.description}
                  sort={p.sort}
                  caret={pillarCaret}
                  {...handlePillar}
                />

                {pOpen &&
                  (themesByPillar[p.code] ?? [])
                    .slice()
                    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
                    .map((t) => {
                      const tOpen = openThemes[t.code] ?? defaultOpen;
                      const themeCaret = (
                        <button
                          type="button"
                          className="text-slate-400 hover:text-slate-600"
                          onClick={() => toggleTheme(t.code)}
                          aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                        >
                          <Chevron open={tOpen} />
                        </button>
                      );

                      const handleTheme = {
                        onBump: (delta: number) =>
                          startTransition(() => actions.bumpSort("theme", t.code, delta)),
                        onSaveName: (v: string) =>
                          startTransition(() => actions.updateName("theme", t.code, v)),
                        onSaveDesc: (v: string) =>
                          startTransition(() => actions.updateDescription("theme", t.code, v)),
                        onSaveSort: (v: number) =>
                          startTransition(() => actions.updateSort("theme", t.code, v)),
                      };

                      return (
                        <div key={t.code}>
                          <RowShell
                            level={1}
                            tag="Theme"
                            tagClass="bg-green-50 text-green-700 ring-1 ring-green-200"
                            code={t.code}
                            name={t.name}
                            description={t.description}
                            sort={t.sort}
                            caret={themeCaret}
                            {...handleTheme}
                          />

                          {tOpen &&
                            (subthemesByTheme[t.code] ?? [])
                              .slice()
                              .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
                              .map((s) => {
                                const handleSub = {
                                  onBump: (delta: number) =>
                                    startTransition(() => actions.bumpSort("subtheme", s.code, delta)),
                                  onSaveName: (v: string) =>
                                    startTransition(() => actions.updateName("subtheme", s.code, v)),
                                  onSaveDesc: (v: string) =>
                                    startTransition(() =>
                                      actions.updateDescription("subtheme", s.code, v),
                                    ),
                                  onSaveSort: (v: number) =>
                                    startTransition(() => actions.updateSort("subtheme", s.code, v)),
                                };

                                return (
                                  <RowShell
                                    key={s.code}
                                    level={2}
                                    tag="Subtheme"
                                    tagClass="bg-red-50 text-red-700 ring-1 ring-red-200"
                                    code={s.code}
                                    name={s.name}
                                    description={s.description}
                                    sort={s.sort}
                                    {...handleSub}
                                  />
                                );
                              })}
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
