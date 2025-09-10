// components/PrimaryFrameworkCards.tsx
"use client";

import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Badge, Card } from "@/lib/ui";

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions?: React.ReactNode | {};
};

function Caret({ open }: { open: boolean }) {
  return open ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />;
}

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      const key = (t.pillar_id || t.pillar_code || "unknown") as string;
      (map[key] ||= []).push(t);
    }
    // Keep incoming order (already sorted by sort_order server-side)
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      const key = (s.theme_id || s.theme_code || "unknown") as string;
      (map[key] ||= []).push(s);
    }
    return map;
  }, [subthemes]);

  const canAct = Boolean(actions);

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <div>Name &amp; Description</div>
        <div className="text-center">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Body */}
      <div>
        {pillars.map((p) => {
          const pillarOpen = openPillars[p.id ?? p.code] ?? defaultOpen;
          const pillarKey = p.id ?? p.code;

          return (
            <div key={`pillar-${pillarKey}`} className="border-b border-gray-100 last:border-0">
              {/* Pillar row */}
              <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3">
                <div className="flex items-start gap-2">
                  <button
                    aria-label={pillarOpen ? "Collapse pillar" : "Expand pillar"}
                    onClick={() => setOpenPillars((s) => ({ ...s, [pillarKey]: !pillarOpen }))}
                    className="mt-1 rounded p-1 hover:bg-gray-50"
                  >
                    <Caret open={pillarOpen} />
                  </button>

                  <div className="min-w-0">
                    {/* Tag + small code to the right */}
                    <div className="flex items-center gap-2">
                      <Badge color="blue">Pillar</Badge>
                      <span className="text-xs text-gray-500">{p.code}</span>
                      <span className="sr-only">—</span>
                    </div>

                    {/* Name + description aligned to left */}
                    <div className="mt-1">
                      <div className="truncate font-medium text-gray-900">{p.name}</div>
                      {p.description ? (
                        <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">{p.description}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">{p.sort_order}</div>

                <div className="flex justify-end">
                  {/* right-aligned action placeholder */}
                  {canAct ? actions : (
                    <button
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50"
                      title="More info"
                    >
                      <Info className="h-4 w-4" />
                      Details
                    </button>
                  )}
                </div>
              </div>

              {/* Themes */}
              {pillarOpen && (themesByPillar[p.id ?? p.code] ?? []).map((t) => {
                const themeKey = t.id ?? t.code;
                const themeOpen = openThemes[themeKey] ?? defaultOpen;

                return (
                  <div key={`theme-${themeKey}`} className="border-t border-gray-100 bg-gray-50/60">
                    <div className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3 pl-10">
                      <div className="flex items-start gap-2">
                        <button
                          aria-label={themeOpen ? "Collapse theme" : "Expand theme"}
                          onClick={() => setOpenThemes((s) => ({ ...s, [themeKey]: !themeOpen }))}
                          className="mt-1 rounded p-1 hover:bg-gray-100"
                        >
                          <Caret open={themeOpen} />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge color="green">Theme</Badge>
                            <span className="text-xs text-gray-500">{t.code}</span>
                          </div>
                          <div className="mt-1">
                            <div className="truncate font-medium text-gray-900">{t.name}</div>
                            {t.description ? (
                              <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">{t.description}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-600">{t.sort_order}</div>
                      <div className="flex justify-end">
                        {canAct ? actions : null}
                      </div>
                    </div>

                    {/* Subthemes */}
                    {themeOpen &&
                      (subthemesByTheme[t.id ?? t.code] ?? []).map((s) => (
                        <div key={`subtheme-${s.id ?? s.code}`} className="grid grid-cols-[1fr,120px,120px] items-center gap-2 px-4 py-3 pl-16">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge color="red">Subtheme</Badge>
                              <span className="text-xs text-gray-500">{s.code}</span>
                            </div>
                            <div className="mt-1">
                              <div className="truncate font-medium text-gray-900">{s.name}</div>
                              {s.description ? (
                                <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">{s.description}</div>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-center text-sm text-gray-600">{s.sort_order}</div>
                          <div className="flex justify-end">
                            {canAct ? actions : null}
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
