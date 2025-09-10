// components/PrimaryFrameworkCards.tsx
"use client";

import React from "react";
import { ChevronRight, Download, Upload, Pencil, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Small color-coded tag for hierarchy labels
function Tag({
  kind,
  children,
}: {
  kind: "pillar" | "theme" | "subtheme";
  children: React.ReactNode;
}) {
  const cls =
    kind === "pillar"
      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
      : kind === "theme"
      ? "bg-green-100 text-green-700 ring-1 ring-green-200"
      : "bg-red-100 text-red-700 ring-1 ring-red-200";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // Optional action handlers (still placeholders — safe no-ops if omitted)
  actions?: {
    onEditPillar?: (p: Pillar) => void;
    onDeletePillar?: (p: Pillar) => void;
    onEditTheme?: (t: Theme) => void;
    onDeleteTheme?: (t: Theme) => void;
    onEditSubtheme?: (s: Subtheme) => void;
    onDeleteSubtheme?: (s: Subtheme) => void;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions = {},
}: Props) {
  // Track expanded pillar/theme rows with Sets — preserves the “small caret” visual
  const [openPillars, setOpenPillars] = React.useState<Set<string>>(
    () => new Set(defaultOpen ? pillars.map((p) => p.id) : [])
  );
  const [openThemes, setOpenThemes] = React.useState<Set<string>>(
    () => new Set()
  );

  const togglePillar = (id: string) =>
    setOpenPillars((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleTheme = (id: string) =>
    setOpenThemes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const byPillar: Record<string, Theme[]> = React.useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      if (!t.pillar_id) continue;
      (m[t.pillar_id] ??= []).push(t);
    }
    // keep incoming order; if you want strict sort use sort_order
    Object.values(m).forEach((arr) =>
      arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    );
    return m;
  }, [themes]);

  const byTheme: Record<string, Subtheme[]> = React.useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      if (!s.theme_id) continue;
      (m[s.theme_id] ??= []).push(s);
    }
    Object.values(m).forEach((arr) =>
      arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    );
    return m;
  }, [subthemes]);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Top utility bar with CSV placeholders */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="text-sm font-medium text-gray-700">Primary Framework</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Import CSV (placeholder)"
            aria-label="Import CSV"
            onClick={() => alert("CSV Import placeholder")}
          >
            <Upload size={16} />
            Import CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Export CSV (placeholder)"
            aria-label="Export CSV"
            onClick={() => alert("CSV Export placeholder")}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr,110px,110px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600">
        <div>Name & description</div>
        <div className="text-center">Code</div>
        <div className="text-center">Sort</div>
      </div>

      {/* Pillars */}
      <ul className="divide-y divide-gray-200">
        {pillars
          ?.slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((p) => {
            const expanded = openPillars.has(p.id);
            const childThemes = byPillar[p.id] ?? [];
            return (
              <li key={p.id}>
                {/* Pillar row */}
                <div className="grid grid-cols-[1fr,110px,110px] items-start gap-2 px-4 py-3">
                  <div>
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        aria-label={expanded ? "Collapse pillar" : "Expand pillar"}
                        className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded hover:bg-gray-100"
                        onClick={() => togglePillar(p.id)}
                        title={expanded ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          size={16} // keep caret size SMALL (as requested)
                          className={`transition-transform ${
                            expanded ? "rotate-90 text-gray-700" : "text-gray-500"
                          }`}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Tag kind="pillar">Pillar</Tag>
                          <span className="truncate text-sm font-semibold text-gray-900">
                            {p.name}
                          </span>
                        </div>
                        {/* Description aligned directly under name */}
                        {p.description ? (
                          <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                            {p.description}
                          </p>
                        ) : null}
                      </div>

                      {/* Quick actions (icons + native tooltips) */}
                      <div className="ml-2 flex flex-none items-center gap-1.5">
                        <button
                          type="button"
                          className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          title="Edit pillar"
                          aria-label="Edit pillar"
                          onClick={() => actions.onEditPillar?.(p)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Delete pillar"
                          aria-label="Delete pillar"
                          onClick={() => actions.onDeletePillar?.(p)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="self-center text-center text-sm text-gray-700">
                    {p.code}
                  </div>

                  {/* Sort */}
                  <div className="self-center text-center text-sm text-gray-700">
                    {p.sort_order ?? ""}
                  </div>
                </div>

                {/* Themes under pillar */}
                {expanded && childThemes.length > 0 && (
                  <div className="bg-gray-50/40">
                    <ul className="divide-y divide-gray-200">
                      {childThemes.map((t) => {
                        const tOpen = openThemes.has(t.id);
                        const childSubs = byTheme[t.id] ?? [];
                        return (
                          <li key={t.id} className="pl-8">
                            {/* Theme row */}
                            <div className="grid grid-cols-[1fr,110px,110px] items-start gap-2 px-4 py-2.5">
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                                  className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded hover:bg-gray-100"
                                  onClick={() => toggleTheme(t.id)}
                                  title={tOpen ? "Collapse" : "Expand"}
                                >
                                  <ChevronRight
                                    size={16}
                                    className={`transition-transform ${
                                      tOpen
                                        ? "rotate-90 text-gray-700"
                                        : "text-gray-500"
                                    }`}
                                  />
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Tag kind="theme">Theme</Tag>
                                    <span className="truncate text-sm font-medium text-gray-900">
                                      {t.name}
                                    </span>
                                  </div>
                                  {t.description ? (
                                    <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                      {t.description}
                                    </p>
                                  ) : null}
                                </div>

                                <div className="ml-2 flex flex-none items-center gap-1.5">
                                  <button
                                    type="button"
                                    className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    title="Edit theme"
                                    aria-label="Edit theme"
                                    onClick={() => actions.onEditTheme?.(t)}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded p-1 text-red-600 hover:bg-red-50"
                                    title="Delete theme"
                                    aria-label="Delete theme"
                                    onClick={() => actions.onDeleteTheme?.(t)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="self-center text-center text-sm text-gray-700">
                                {t.code}
                              </div>
                              <div className="self-center text-center text-sm text-gray-700">
                                {t.sort_order ?? ""}
                              </div>
                            </div>

                            {/* Subthemes under theme */}
                            {tOpen && childSubs.length > 0 && (
                              <ul className="divide-y divide-gray-200 bg-white">
                                {childSubs.map((s) => (
                                  <li key={s.id} className="pl-16">
                                    <div className="grid grid-cols-[1fr,110px,110px] items-start gap-2 px-4 py-2.5">
                                      <div className="flex items-start gap-2">
                                        {/* spacer to align with carets above */}
                                        <div className="h-5 w-5 flex-none" />
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <Tag kind="subtheme">Subtheme</Tag>
                                            <span className="truncate text-sm text-gray-900">
                                              {s.name}
                                            </span>
                                          </div>
                                          {s.description ? (
                                            <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                                              {s.description}
                                            </p>
                                          ) : null}
                                        </div>

                                        <div className="ml-2 flex flex-none items-center gap-1.5">
                                          <button
                                            type="button"
                                            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            title="Edit subtheme"
                                            aria-label="Edit subtheme"
                                            onClick={() => actions.onEditSubtheme?.(s)}
                                          >
                                            <Pencil size={16} />
                                          </button>
                                          <button
                                            type="button"
                                            className="rounded p-1 text-red-600 hover:bg-red-50"
                                            title="Delete subtheme"
                                            aria-label="Delete subtheme"
                                            onClick={() => actions.onDeleteSubtheme?.(s)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="self-center text-center text-sm text-gray-700">
                                        {s.code}
                                      </div>
                                      <div className="self-center text-center text-sm text-gray-700">
                                        {s.sort_order ?? ""}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
}
