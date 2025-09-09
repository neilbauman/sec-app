// components/PrimaryFrameworkCards.tsx
'use client'

import { useMemo, useState } from 'react'
import type { AppRole } from '@/lib/role'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

export type Props = {
  role: AppRole
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

const TAG_COLORS = {
  pillar: 'bg-rose-500',
  theme: 'bg-sky-500',
  subtheme: 'bg-emerald-500',
}

function Tag({ level, code }: { level: 'pillar' | 'theme' | 'subtheme'; code: string }) {
  const color = TAG_COLORS[level]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${color}`}
      title={level}
    >
      {code}
    </span>
  )
}

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  // group themes by pillar; subthemes by theme
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {}
    for (const t of themes) {
      (m[t.pillar_code] ||= []).push(t)
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [themes])

  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {}
    for (const s of subthemes) {
      (m[s.theme_code] ||= []).push(s)
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [subthemes])

  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>(() => ({})) // default collapsed
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>(() => ({}))   // default collapsed

  return (
    <div className="space-y-4">
      {pillars
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((p) => {
          const isOpen = !!openPillars[p.code]
          const pillarThemes = themesByPillar[p.code] || []
          return (
            <div key={p.code} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between p-4">
                <div className="flex items-start gap-3">
                  <button
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                    onClick={() =>
                      setOpenPillars((prev) => ({ ...prev, [p.code]: !prev[p.code] }))
                    }
                    className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                  </button>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Tag level="pillar" code={p.code} />
                      <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                      <span className="text-xs text-slate-400">sort: {p.sort_order}</span>
                    </div>
                    {p.description && (
                      <p className="max-w-3xl text-sm text-slate-600">{p.description}</p>
                    )}
                  </div>
                </div>
                {/* actions placeholder (read-only for now) */}
                <div className="text-xs text-slate-400">{role === 'super-admin' ? 'read-only (actions coming next)' : 'read-only'}</div>
              </div>

              {isOpen && pillarThemes.length > 0 && (
                <div className="border-t border-slate-200 p-4 pl-12">
                  <div className="space-y-3">
                    {pillarThemes.map((t) => {
                      const tOpen = !!openThemes[t.code]
                      const tSubs = subsByTheme[t.code] || []
                      return (
                        <div key={t.code} className="rounded-xl border border-slate-200">
                          <div className="flex items-start justify-between p-3">
                            <div className="flex items-start gap-3">
                              <button
                                aria-label={tOpen ? 'Collapse' : 'Expand'}
                                onClick={() =>
                                  setOpenThemes((prev) => ({ ...prev, [t.code]: !prev[t.code] }))
                                }
                                className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                              >
                                <span className={`transition-transform ${tOpen ? 'rotate-90' : ''}`}>
                                  ▶
                                </span>
                              </button>
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <Tag level="theme" code={t.code} />
                                  <h4 className="text-base font-semibold text-slate-900">{t.name}</h4>
                                  <span className="text-xs text-slate-400">sort: {t.sort_order}</span>
                                </div>
                                {t.description && (
                                  <p className="max-w-3xl text-sm text-slate-600">{t.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {tOpen && tSubs.length > 0 && (
                            <div className="border-t border-slate-200 p-3 pl-16">
                              <div className="grid gap-2">
                                {tSubs.map((s) => (
                                  <div
                                    key={s.code}
                                    className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Tag level="subtheme" code={s.code} />
                                      <div>
                                        <div className="mb-1 flex items-center gap-2">
                                          <span className="font-medium text-slate-900">{s.name}</span>
                                          <span className="text-xs text-slate-400">
                                            sort: {s.sort_order}
                                          </span>
                                        </div>
                                        {s.description && (
                                          <p className="max-w-3xl text-sm text-slate-600">
                                            {s.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {/* future subtheme actions here */}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
