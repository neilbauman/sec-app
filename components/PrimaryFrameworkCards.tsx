'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export type Pillar = { code: string; name: string; description?: string; sort_order: number };
export type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number };
export type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number };

type AppRole = 'super-admin' | 'country-admin' | 'public';

type Props = {
  role: AppRole;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

function LevelTag({ level }: { level: 'Pillar' | 'Theme' | 'Subtheme' }) {
  const styles =
    level === 'Pillar'
      ? 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-200'
      : level === 'Theme'
      ? 'bg-teal-100 text-teal-700 ring-1 ring-inset ring-teal-200'
      : 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200';

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles}`}>
      {level}
    </span>
  );
}

function RowHeader({
  isOpen,
  onToggle,
  leftIndent = 0,
  tag,
  code,
  name,
  description,
  metaRight,
}: {
  isOpen: boolean;
  onToggle: () => void;
  leftIndent?: number;
  tag: 'Pillar' | 'Theme' | 'Subtheme';
  code: string;
  name: string;
  description?: string;
  metaRight?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 ${leftIndent ? `pl-${leftIndent}` : ''}`}
      role="button"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <div className="h-6 w-6 flex items-center justify-center mt-0.5">
        {isOpen ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <LevelTag level={tag} />
          <span className="text-[11px] text-slate-500 tracking-wide">{code}</span>
          <h3 className="text-sm font-medium text-slate-900">{name}</h3>
        </div>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </div>

      {metaRight ? <div className="text-xs text-slate-500">{metaRight}</div> : null}
    </div>
  );
}

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  // Group themes by pillar, and subthemes by theme
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      (m[t.pillar_code] ||= []).push(t);
    }
    // keep theme order stable
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    }
    return m;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      (m[s.theme_code] ||= []).push(s);
    }
    // keep subtheme order stable
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    }
    return m;
  }, [subthemes]);

  // Default to collapsed per your request
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (code: string) => setOpenPillars((s) => ({ ...s, [code]: !s[code] }));
  const toggleTheme = (code: string) => setOpenThemes((s) => ({ ...s, [code]: !s[code] }));

  return (
    <div className="space-y-4">
      {/* header bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Role: <span className="font-medium text-slate-900">{role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <a href="/admin/framework/primary/export" className="underline hover:no-underline">
            Export CSV
          </a>
          {/* Import CSV button can be wired later */}
          <span className="text-slate-400">·</span>
          <a href="/dashboard" className="underline hover:no-underline">
            Back to Dashboard
          </a>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 gap-4">
        {pillars
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
          .map((p) => {
            const isOpen = !!openPillars[p.code];
            const pillarThemes = themesByPillar[p.code] ?? []; // ✅ use p.code here
            const countsRight = (
              <div className="inline-flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                  {pillarThemes.length} theme{pillarThemes.length === 1 ? '' : 's'}
                </span>
              </div>
            );

            return (
              <div key={p.code} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-4">
                  <RowHeader
                    isOpen={isOpen}
                    onToggle={() => togglePillar(p.code)}
                    tag="Pillar"
                    code={p.code}
                    name={p.name}
                    description={p.description}
                    metaRight={countsRight}
                  />
                </div>

                {isOpen && pillarThemes.length > 0 && (
                  <div className="border-t border-slate-200">
                    {pillarThemes.map((t) => {
                      const tOpen = !!openThemes[t.code];
                      const tSubthemes = subsByTheme[t.code] ?? [];
                      const tCounts = (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                          {tSubthemes.length} subtheme{tSubthemes.length === 1 ? '' : 's'}
                        </span>
                      );
                      return (
                        <div key={t.code} className="px-4 py-3 border-b last:border-b-0 border-slate-200">
                          <RowHeader
                            isOpen={tOpen}
                            onToggle={() => toggleTheme(t.code)}
                            leftIndent={6}
                            tag="Theme"
                            code={t.code}
                            name={t.name}
                            description={t.description}
                            metaRight={tCounts}
                          />

                          {tOpen && tSubthemes.length > 0 && (
                            <div className="mt-3 ml-12 space-y-2">
                              {tSubthemes.map((s) => (
                                <div
                                  key={s.code}
                                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <LevelTag level="Subtheme" />
                                        <span className="text-[11px] text-slate-500 tracking-wide">{s.code}</span>
                                        <h4 className="text-sm font-medium text-slate-900">{s.name}</h4>
                                      </div>
                                      {s.description ? (
                                        <p className="mt-1 text-sm text-slate-700">{s.description}</p>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
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
