"use client";

// components/PrimaryFrameworkCards.tsx
import { useMemo, useState } from "react";

type Pillar = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id?: string;
  code: string;
  pillar_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id?: string;
  code: string;
  theme_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // Optional action hooks (intentionally unused for now; keeps API stable)
  actions?: {
    updateName?: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void>;
    updateDescription?: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void>;
    updateSort?: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void>;
    bumpSort?: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void>;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
}: Props) {
  // open state maps
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const byPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    // sort themes in each pillar
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    return m;
  }, [themes]);

  const byTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    return m;
  }, [subthemes]);

  const sortedPillars = useMemo(
    () => [...(pillars ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [pillars]
  );

  const togglePillar = (code: string) =>
    setOpenPillars((prev) => ({ ...prev, [code]: prev[code] ?? defaultOpen ? false : !(prev[code] ?? defaultOpen) }));

  const toggleTheme = (code: string) =>
    setOpenThemes((prev) => ({ ...prev, [code]: !(prev[code] ?? defaultOpen) }));

  // simple caret icon
  const Caret = ({ open }: { open: boolean }) => (
    <span
      aria-hidden
      className={`inline-block transition-transform ${open ? "rotate-90" : "rotate-0"}`}
      style={{ transformOrigin: "center" }}
    >
      ▶
    </span>
  );

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-right">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {sortedPillars.map((p) => {
          const isOpen = openPillars[p.code] ?? defaultOpen;
          const pillarThemes = byPillar[p.code] ?? [];

          return (
            <div key={p.code} className="bg-white">
              {/* Pillar row */}
              <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => togglePillar(p.code)}
                    aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                    className="mt-0.5 shrink-0 rounded p-1 hover:bg-gray-100"
                  >
                    <Caret open={isOpen} />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Pillar</span>
                      <span className="text-xs font-semibold text-gray-400">{p.code}</span>
                      <span className="truncate text-sm font-semibold text-gray-900">{p.name}</span>
                    </div>
                    {p.description ? (
                      <div className="mt-1 text-sm text-gray-600">{p.description}</div>
                    ) : null}
                  </div>
                </div>

                <div className="self-center text-right text-sm tabular-nums text-gray-700">
                  {p.sort_order ?? 0}
                </div>

                <div className="self-center text-right text-sm text-gray-400">—</div>
              </div>

              {/* Theme rows */}
              {isOpen &&
                pillarThemes.map((t) => {
                  const tOpen = openThemes[t.code] ?? defaultOpen;
                  const themeSubthemes = byTheme[t.code] ?? [];
                  return (
                    <div key={t.code} className="bg-gray-50/40">
                      <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3 pl-10">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleTheme(t.code)}
                            aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                            className="mt-0.5 shrink-0 rounded p-1 hover:bg-gray-100"
                          >
                            <Caret open={tOpen} />
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                Theme
                              </span>
                              <span className="text-xs font-semibold text-gray-400">{t.code}</span>
                              <span className="truncate text-sm font-semibold text-gray-900">{t.name}</span>
                            </div>
                            {t.description ? (
                              <div className="mt-1 text-sm text-gray-600">{t.description}</div>
                            ) : null}
                          </div>
                        </div>

                        <div className="self-center text-right text-sm tabular-nums text-gray-700">
                          {t.sort_order ?? 0}
                        </div>

                        <div className="self-center text-right text-sm text-gray-400">—</div>
                      </div>

                      {/* Subtheme rows */}
                      {tOpen &&
                        themeSubthemes.map((s) => (
                          <div
                            key={s.code}
                            className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3 pl-20"
                          >
                            <div className="flex items-start gap-3">
                              {/* keeps hierarchy alignment space */}
                              <span className="mt-0.5 inline-block w-4" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                    Subtheme
                                  </span>
                                  <span className="text-xs font-semibold text-gray-400">{s.code}</span>
                                  <span className="truncate text-sm font-semibold text-gray-900">{s.name}</span>
                                </div>
                                {s.description ? (
                                  <div className="mt-1 text-sm text-gray-600">{s.description}</div>
                                ) : null}
                              </div>
                            </div>

                            <div className="self-center text-right text-sm tabular-nums text-gray-700">
                              {s.sort_order ?? 0}
                            </div>

                            <div className="self-center text-right text-sm text-gray-400">—</div>
                          </div>
                        ))}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
