"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/app/admin/framework/primary/editor/page";

type Props = {
  defaultOpen?: boolean; // if true, expand all pillars and themes by default
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

function Badge({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "slate";
}) {
  const map: Record<string, string> = {
    blue:
      "inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200",
    green:
      "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200",
    red:
      "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200",
    slate:
      "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200",
  };
  return <span className={map[color]}>{children}</span>;
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
}: Props) {
  // Build lookups
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      (m[t.pillar_code] ??= []).push(t);
    }
    // sort within pillar by sort_order then name
    Object.values(m).forEach((arr) =>
      arr.sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          a.name.localeCompare(b.name),
      ),
    );
    return m;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      (m[s.theme_code] ??= []).push(s);
    }
    Object.values(m).forEach((arr) =>
      arr.sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          a.name.localeCompare(b.name),
      ),
    );
    return m;
  }, [subthemes]);

  // Collapsed by default unless defaultOpen = true
  const initialPillarState = useMemo(() => {
    const state: Record<string, boolean> = {};
    for (const p of pillars) state[p.code] = !!defaultOpen;
    return state;
  }, [pillars, defaultOpen]);

  const initialThemeState = useMemo(() => {
    const state: Record<string, boolean> = {};
    for (const t of themes) state[t.code] = !!defaultOpen;
    return state;
  }, [themes, defaultOpen]);

  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(initialPillarState);
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>(initialThemeState);

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !s[code] }));

  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !s[code] }));

  // Sort pillars stable
  const sortedPillars = useMemo(
    () =>
      [...pillars].sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          a.name.localeCompare(b.name),
      ),
    [pillars],
  );

  return (
    <div className="space-y-4">
      {sortedPillars.map((p) => {
        const isOpen = !!openPillars[p.code];
        const pillarThemes = themesByPillar[p.code] ?? [];
        return (
          <section
            key={p.code}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              onClick={() => togglePillar(p.code)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge color="blue">Pillar</Badge>
                  <h2 className="truncate text-lg font-semibold text-slate-900">
                    {p.name}
                  </h2>
                </div>
                {p.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {p.description}
                  </p>
                ) : null}
              </div>
              <span
                className={`shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
                aria-hidden
              >
                ▶
              </span>
            </button>

            {isOpen && (
              <div className="divide-y">
                {pillarThemes.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-slate-500">
                    No themes yet.
                  </div>
                ) : (
                  pillarThemes.map((t) => {
                    const tOpen = !!openThemes[t.code];
                    const tSubs = subthemesByTheme[t.code] ?? [];
                    return (
                      <div key={t.code} className="px-5 py-4">
                        <button
                          onClick={() => toggleTheme(t.code)}
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge color="green">Theme</Badge>
                              <h3 className="truncate font-medium text-slate-900">
                                {t.name}
                              </h3>
                            </div>
                            {t.description ? (
                              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                {t.description}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={`shrink-0 text-slate-400 transition-transform ${
                              tOpen ? "rotate-90" : ""
                            }`}
                            aria-hidden
                          >
                            ▶
                          </span>
                        </button>

                        {tOpen && (
                          <div className="mt-3 space-y-2 pl-7">
                            {tSubs.length === 0 ? (
                              <div className="text-sm text-slate-500">
                                No subthemes yet.
                              </div>
                            ) : (
                              tSubs.map((s) => (
                                <div
                                  key={s.code}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge color="red">Subtheme</Badge>
                                    <div className="font-medium text-slate-900">
                                      {s.name}
                                    </div>
                                  </div>
                                  {s.description ? (
                                    <p className="mt-1 text-sm text-slate-600">
                                      {s.description}
                                    </p>
                                  ) : null}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
