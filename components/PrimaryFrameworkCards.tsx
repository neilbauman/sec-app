// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";

/**
 * Lightweight local shapes so we don't fight cross-module type nominal issues.
 * These must match your DB payload shape (structural typing will accept them).
 */
type Pillar = {
  id?: string;              // uuid
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id?: string;              // uuid
  code: string;             // "T1.1" etc
  pillar_id?: string | null;
  pillar_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id?: string;              // uuid
  code: string;
  theme_id?: string | null;
  theme_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Entity = "pillar" | "theme" | "subtheme";

type Actions = {
  updateName?: (entity: Entity, code: string, name: string) => Promise<void>;
  updateDescription?: (
    entity: Entity,
    code: string,
    description: string
  ) => Promise<void>;
  updateSort?: (
    entity: Entity,
    code: string,
    sort_order: number
  ) => Promise<void>;
  bumpSort?: (entity: Entity, code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: Actions; // optional; if absent we render disabled/hidden controls
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  // open state maps
  const [openPillar, setOpenPillar] = useState<Record<string, boolean>>({});
  const [openTheme, setOpenTheme] = useState<Record<string, boolean>>({});

  // Index themes by pillar_id (fallback pillar_code) and subthemes by theme_id (fallback theme_code)
  const { themesByPillar, subthemesByTheme } = useMemo(() => {
    const tByP: Record<string, Theme[]> = {};
    for (const t of themes ?? []) {
      const key =
        (t.pillar_id ?? undefined) ||
        (t.pillar_code ?? undefined) ||
        ""; // empty means "unassigned"
      if (!tByP[key]) tByP[key] = [];
      tByP[key].push(t);
    }

    const sByT: Record<string, Subtheme[]> = {};
    for (const s of subthemes ?? []) {
      const key =
        (s.theme_id ?? undefined) || (s.theme_code ?? undefined) || "";
      if (!sByT[key]) sByT[key] = [];
      sByT[key].push(s);
    }

    // Sort by sort_order (null/undefined last), then by code as stable tie-breaker
    const bySort = <T extends { sort_order?: number | null; code: string }>(
      a: T,
      b: T
    ) => {
      const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (sa !== sb) return sa - sb;
      return a.code.localeCompare(b.code);
    };

    for (const k of Object.keys(tByP)) tByP[k].sort(bySort);
    for (const k of Object.keys(sByT)) sByT[k].sort(bySort);

    return { themesByPillar: tByP, subthemesByTheme: sByT };
  }, [themes, subthemes]);

  const Toggle = ({
    open,
    onClick,
  }: {
    open: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      aria-label={open ? "Collapse" : "Expand"}
      onClick={onClick}
      className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
    >
      {/* simple inline chevron, sized a bit larger */}
      <svg
        className={`h-4 w-4 transition-transform ${
          open ? "rotate-90" : ""
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M7 5l6 5-6 5V5z" />
      </svg>
    </button>
  );

  const ActionIcon = ({
    title,
    onClick,
    children,
    disabled,
  }: {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name & Description</div>
        <div className="text-center">Sort Order</div>
        <div className="text-right pr-1">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {(pillars ?? [])
          .slice()
          .sort((a, b) => {
            const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
            const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
            if (sa !== sb) return sa - sb;
            return a.code.localeCompare(b.code);
          })
          .map((p) => {
            const pKey = p.id ?? p.code ?? "";
            const pOpen = openPillar[pKey] ?? defaultOpen;
            const tList =
              themesByPillar[p.id ?? ""] ||
              themesByPillar[p.code ?? ""] ||
              [];

            return (
              <div key={`pillar-${pKey}`} className="bg-white">
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                  <div className="flex items-start">
                    <Toggle
                      open={pOpen}
                      onClick={() =>
                        setOpenPillar((s) => ({ ...s, [pKey]: !pOpen }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                          Pillar
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">
                          {p.code}
                        </span>
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {p.name}
                        </span>
                      </div>
                      {p.description ? (
                        <p className="mt-1 text-[13px] leading-snug text-gray-600">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-700">
                    {p.sort_order ?? ""}
                  </div>

                  <div className="flex justify-end gap-1 pr-1">
                    {/* icons only, optional actions */}
                    <ActionIcon
                      title="Move up"
                      onClick={
                        canAct ? () => actions!.bumpSort?.("pillar", p.code, -1) : undefined
                      }
                      disabled={!canAct}
                    >
                      {/* up chevron */}
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                        <path d="M10 6l-6 6h12L10 6z" />
                      </svg>
                    </ActionIcon>
                    <ActionIcon
                      title="Move down"
                      onClick={
                        canAct ? () => actions!.bumpSort?.("pillar", p.code, +1) : undefined
                      }
                      disabled={!canAct}
                    >
                      {/* down chevron */}
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                        <path d="M10 14l6-6H4l6 6z" />
                      </svg>
                    </ActionIcon>
                  </div>
                </div>

                {/* Themes under pillar */}
                {pOpen &&
                  tList.map((t) => {
                    const tKey = t.id ?? t.code ?? "";
                    const tOpen = openTheme[tKey] ?? defaultOpen;
                    const sList =
                      subthemesByTheme[t.id ?? ""] ||
                      subthemesByTheme[t.code ?? ""] ||
                      [];

                    return (
                      <div
                        key={`theme-${tKey}`}
                        className="border-t border-gray-100 bg-white"
                      >
                        {/* Theme row */}
                        <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                          <div className="flex items-start pl-8">
                            <Toggle
                              open={tOpen}
                              onClick={() =>
                                setOpenTheme((s) => ({ ...s, [tKey]: !tOpen }))
                              }
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                  Theme
                                </span>
                                <span className="text-[11px] font-semibold text-gray-400">
                                  {t.code}
                                </span>
                                <span className="ml-1 text-sm font-medium text-gray-900">
                                  {t.name}
                                </span>
                              </div>
                              {t.description ? (
                                <p className="mt-1 text-[13px] leading-snug text-gray-600">
                                  {t.description}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-center text-sm text-gray-700">
                            {t.sort_order ?? ""}
                          </div>

                          <div className="flex justify-end gap-1 pr-1">
                            <ActionIcon
                              title="Move up"
                              onClick={
                                canAct
                                  ? () => actions!.bumpSort?.("theme", t.code, -1)
                                  : undefined
                              }
                              disabled {!canAct}
                            >
                              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                <path d="M10 6l-6 6h12L10 6z" />
                              </svg>
                            </ActionIcon>
                            <ActionIcon
                              title="Move down"
                              onClick={
                                canAct
                                  ? () => actions!.bumpSort?.("theme", t.code, +1)
                                  : undefined
                              }
                              disabled={!canAct}
                            >
                              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                <path d="M10 14l6-6H4l6 6z" />
                              </svg>
                            </ActionIcon>
                          </div>
                        </div>

                        {/* Subthemes under theme */}
                        {tOpen &&
                          sList.map((s) => (
                            <div
                              key={`subtheme-${s.id ?? s.code ?? ""}`}
                              className="border-t border-gray-100 bg-white"
                            >
                              <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                                <div className="flex items-start pl-16">
                                  {/* spacer where caret would be */}
                                  <div className="mr-2 h-6 w-6" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                                        Subtheme
                                      </span>
                                      <span className="text-[11px] font-semibold text-gray-400">
                                        {s.code}
                                      </span>
                                      <span className="ml-1 text-sm font-medium text-gray-900">
                                        {s.name}
                                      </span>
                                    </div>
                                    {s.description ? (
                                      <p className="mt-1 text-[13px] leading-snug text-gray-600">
                                        {s.description}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="text-center text-sm text-gray-700">
                                  {s.sort_order ?? ""}
                                </div>

                                <div className="flex justify-end gap-1 pr-1">
                                  <ActionIcon
                                    title="Move up"
                                    onClick={
                                      canAct
                                        ? () =>
                                            actions!.bumpSort?.(
                                              "subtheme",
                                              s.code,
                                              -1
                                            )
                                        : undefined
                                    }
                                    disabled={!canAct}
                                  >
                                    <svg
                                      viewBox="0 0 20 20"
                                      className="h-4 w-4"
                                      fill="currentColor"
                                    >
                                      <path d="M10 6l-6 6h12L10 6z" />
                                    </svg>
                                  </ActionIcon>
                                  <ActionIcon
                                    title="Move down"
                                    onClick={
                                      canAct
                                        ? () =>
                                            actions!.bumpSort?.(
                                              "subtheme",
                                              s.code,
                                              +1
                                            )
                                        : undefined
                                    }
                                    disabled={!canAct}
                                  >
                                    <svg
                                      viewBox="0 0 20 20"
                                      className="h-4 w-4"
                                      fill="currentColor"
                                    >
                                      <path d="M10 14l6-6H4l6 6z" />
                                    </svg>
                                  </ActionIcon>
                                </div>
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
