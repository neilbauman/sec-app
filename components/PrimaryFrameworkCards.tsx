"use client";

// components/PrimaryFrameworkCards.tsx
import { useMemo, useState } from "react";

/**
 * Local, UI-only types to avoid coupling to DB shapes.
 * All fields that might be absent in the fetch are optional.
 */
type Pillar = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  pillar_code: string; // FK by code
};

type Subtheme = {
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  theme_code: string; // FK by code
};

export type Actions = {
  updateName?: (entity: "pillar" | "theme" | "subtheme", code: string, name: string) => Promise<void> | void;
  updateDescription?: (entity: "pillar" | "theme" | "subtheme", code: string, description: string) => Promise<void> | void;
  updateSort?: (entity: "pillar" | "theme" | "subtheme", code: string, sort: number) => Promise<void> | void;
  bumpSort?: (entity: "pillar" | "theme" | "subtheme", code: string, delta: number) => Promise<void> | void;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions; // optional for read-only render
};

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: "blue" | "green" | "red" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${map[color]}`}>
      {children}
    </span>
  );
}

function ActionIcon({ label, disabled = true }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={`h-8 w-8 rounded-md border border-gray-200 text-gray-400 ${disabled ? "cursor-not-allowed bg-gray-50" : "hover:bg-gray-100"}`}
      title={label}
      disabled={disabled}
    >
      {/* simple dot icon placeholder to keep bundle light */}
      <span className="block text-lg leading-none">•</span>
    </button>
  );
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // UI state: which rows are expanded
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Group themes by pillar_code (strictly snake_case to match DB)
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key = t.pillar_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(t);
    }
    // ensure stable order by sort_order then name
    for (const k of Object.keys(m)) {
      m[k] = m[k].slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name));
    }
    return m;
  }, [themes]);

  // Group subthemes by theme_code
  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key = s.theme_code ?? "";
      if (!m[key]) m[key] = [];
      m[key].push(s);
    }
    for (const k of Object.keys(m)) {
      m[k] = m[k].slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name));
    }
    return m;
  }, [subthemes]);

  const togglePillar = (code: string) => setOpenPillars((x) => ({ ...x, [code]: !(x[code] ?? defaultOpen) }));
  const toggleTheme = (code: string) => setOpenThemes((x) => ({ ...x, [code]: !(x[code] ?? defaultOpen) }));

  const sortedPillars = (pillars ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name));

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-center">Sort</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {sortedPillars.map((p) => {
          const pOpen = openPillars[p.code] ?? defaultOpen;
          const pThemes = themesByPillar[p.code] ?? [];

          return (
            <div key={p.code}>
              {/* Pillar row */}
              <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-0.5 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePillar(p.code)}
                    aria-label={pOpen ? "Collapse pillar" : "Expand pillar"}
                  >
                    <Caret open={pOpen} />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">Pillar</Tag>
                      <span className="text-xs font-semibold text-gray-400">{p.code}</span>
                      <span className="text-base font-medium text-gray-900">{p.name}</span>
                    </div>
                    {p.description ? (
                      <div className="mt-1 text-sm text-gray-600">{p.description}</div>
                    ) : null}
                  </div>
                </div>
                <div className="text-center tabular-nums text-gray-700">{p.sort_order ?? 0}</div>
                <div className="flex items-center justify-center gap-1">
                  <ActionIcon label="Edit (disabled)" disabled={!canAct} />
                  <ActionIcon label="Move up (disabled)" disabled={!canAct} />
                  <ActionIcon label="Move down (disabled)" disabled={!canAct} />
                </div>
              </div>

              {/* Themes under this pillar */}
              {pOpen &&
                pThemes.map((t) => {
                  const tOpen = openThemes[t.code] ?? defaultOpen;
                  const tSubs = subthemesByTheme[t.code] ?? [];

                  return (
                    <div key={t.code} className="bg-gray-50/50">
                      <div className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                        <div className="ml-6 flex items-start gap-3">
                          <button
                            type="button"
                            className="mt-0.5 text-gray-500 hover:text-gray-700"
                            onClick={() => toggleTheme(t.code)}
                            aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                          >
                            <Caret open={tOpen} />
                          </button>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Tag color="green">Theme</Tag>
                              <span className="text-xs font-semibold text-gray-400">{t.code}</span>
                              <span className="text-base font-medium text-gray-900">{t.name}</span>
                            </div>
                            {t.description ? (
                              <div className="mt-1 text-sm text-gray-600">{t.description}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-center tabular-nums text-gray-700">{t.sort_order ?? 0}</div>
                        <div className="flex items-center justify-center gap-1">
                          <ActionIcon label="Edit (disabled)" disabled={!canAct} />
                          <ActionIcon label="Move up (disabled)" disabled={!canAct} />
                          <ActionIcon label="Move down (disabled)" disabled={!canAct} />
                        </div>
                      </div>

                      {/* Subthemes directly under THIS theme */}
                      {tOpen &&
                        tSubs.map((s) => (
                          <div key={s.code} className="grid grid-cols-[1fr,120px,120px] items-start gap-2 px-4 py-3">
                            <div className="ml-16 flex items-start gap-3">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <Tag color="red">Subtheme</Tag>
                                  <span className="text-xs font-semibold text-gray-400">{s.code}</span>
                                  <span className="text-base font-medium text-gray-900">{s.name}</span>
                                </div>
                                {s.description ? (
                                  <div className="mt-1 text-sm text-gray-600">{s.description}</div>
                                ) : null}
                              </div>
                            </div>
                            <div className="text-center tabular-nums text-gray-700">{s.sort_order ?? 0}</div>
                            <div className="flex items-center justify-center gap-1">
                              <ActionIcon label="Edit (disabled)" disabled={!canAct} />
                              <ActionIcon label="Move up (disabled)" disabled={!canAct} />
                              <ActionIcon label="Move down (disabled)" disabled={!canAct} />
                            </div>
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
