"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

type TagProps = {
  tone: "blue" | "green" | "red";
  children: React.ReactNode;
};

function Tag({ tone, children }: TagProps) {
  const base =
    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  } as const;
  return <span className={`${base} ${tones[tone]}`}>{children}</span>;
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
}: Props) {
  // maps for quick lookup
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      (map[t.pillar_code] ??= []).push(t);
    }
    // ensure stable order by sort_order then name
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
      );
    }
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      (map[s.theme_code] ??= []).push(s);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
      );
    }
    return map;
  }, [subthemes]);

  // expansion state (all collapsed by default)
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        pillars.map((p) => [p.code, Boolean(defaultOpen)]),
      ),
  );
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !s[code] }));
  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !s[code] }));

  // utility: row layout for list with 3 columns
  const Row = ({
    left,
    sort,
    actions,
  }: {
    left: React.ReactNode;
    sort?: React.ReactNode;
    actions?: React.ReactNode;
  }) => (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_72px] items-start gap-3 px-4 py-3">
      <div>{left}</div>
      <div className="text-right text-sm text-slate-500">{sort}</div>
      <div className="flex justify-end">{actions}</div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="grid grid-cols-[minmax(0,1fr)_96px_72px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Name & description
        </div>
        <div className="text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
          Sort order
        </div>
        <div className="text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
          Actions
        </div>
      </div>

      {/* body */}
      <div className="divide-y divide-slate-200">
        {pillars
          .slice()
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
              a.name.localeCompare(b.name),
          )
          .map((p) => {
            const pOpen = !!openPillars[p.code];
            const tList = themesByPillar[p.code] ?? [];

            return (
              <div key={p.code} className="bg-white">
                <Row
                  left={
                    <div className="flex items-start">
                      <button
                        onClick={() => togglePillar(p.code)}
                        className="mt-0.5 mr-2 rounded p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        aria-label={pOpen ? "Collapse pillar" : "Expand pillar"}
                      >
                        {pOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Tag tone="blue">Pillar</Tag>
                          <span className="text-xs font-medium text-slate-400">
                            {p.code}
                          </span>
                          <span className="ml-1 truncate text-base font-medium text-slate-900">
                            {p.name}
                          </span>
                        </div>
                        {p.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  }
                  sort={p.sort_order}
                  actions={
                    <button
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  }
                />

                {pOpen && tList.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {tList.map((t) => {
                      const tOpen = !!openThemes[t.code];
                      const sList = subthemesByTheme[t.code] ?? [];

                      return (
                        <Row
                          key={t.code}
                          left={
                            <div className="flex items-start pl-6">
                              <button
                                onClick={() => toggleTheme(t.code)}
                                className="mt-0.5 mr-2 rounded p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                              >
                                {tOpen ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Tag tone="green">Theme</Tag>
                                  <span className="text-xs font-medium text-slate-400">
                                    {t.code}
                                  </span>
                                  <span className="ml-1 truncate text-base font-medium text-slate-900">
                                    {t.name}
                                  </span>
                                </div>
                                {t.description && (
                                  <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {t.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          }
                          sort={t.sort_order}
                          actions={
                            <button
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          }
                        >
                          {/* empty children; Row only uses props */}
                        </Row>
                      );
                    })}

                    {/* subthemes under an expanded theme */}
                    {tList.map((t) => {
                      const tOpen = !!openThemes[t.code];
                      const sList = subthemesByTheme[t.code] ?? [];
                      if (!tOpen || sList.length === 0) return null;

                      return sList.map((s) => (
                        <Row
                          key={s.code}
                          left={
                            <div className="flex items-start pl-14">
                              {/* spacer where caret would be */}
                              <div className="mr-2 h-4 w-4" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Tag tone="red">Subtheme</Tag>
                                  <span className="text-xs font-medium text-slate-400">
                                    {s.code}
                                  </span>
                                  <span className="ml-1 truncate text-base font-medium text-slate-900">
                                    {s.name}
                                  </span>
                                </div>
                                {s.description && (
                                  <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {s.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          }
                          sort={s.sort_order}
                          actions={
                            <button
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          }
                        />
                      ));
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
