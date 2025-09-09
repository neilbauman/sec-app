'use client'

import { useMemo, useState } from 'react'
import type { AppRole } from '@/lib/role'

export type Pillar = { code: string; name: string; description?: string; sort_order: number }
export type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
export type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

type Props = {
  role: AppRole
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {}
    for (const t of themes) {
      (m[t.pillar_code] ??= []).push(t)
    }
    for (const k of Object.keys(m)) m[k].sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [themes])

  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {}
    for (const s of subthemes) {
      (m[s.theme_code] ??= []).push(s)
    }
    for (const k of Object.keys(m)) m[k].sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [subthemes])

  // default collapsed
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({})

  const toggleP = (code: string) => setOpenPillars(o => ({ ...o, [code]: !o[code] }))
  const toggleT = (code: string) => setOpenThemes(o => ({ ...o, [code]: !o[code] }))

  return (
    <section className="space-y-4">
      {pillars.sort((a,b)=>a.sort_order-b.sort_order).map(p => {
        const isOpen = !!openPillars[p.code]
        return (
          <div key={p.code} className="rounded-xl border bg-white">
            <button
              onClick={() => toggleP(p.code)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-badge-primary/10 text-badge-primary text-xs px-2 py-0.5">
                  Pillar
                </span>
                <span className="font-medium">{p.name}</span>
              </div>
              <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 5l6 5-6 5V5z" />
              </svg>
            </button>

            {isOpen && (
              <div className="divide-y">
                {(themesByPillar[p.code] ?? []).map(t => {
                  const tOpen = !!openThemes[t.code]
                  return (
                    <div key={t.code} className="px-4 py-3">
                      <button onClick={() => toggleT(t.code)} className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-badge-theme/10 text-badge-theme text-xs px-2 py-0.5">
                            Theme
                          </span>
                          <span className="font-medium">{t.name}</span>
                        </div>
                        <svg className={`h-4 w-4 transition-transform ${tOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 5l6 5-6 5V5z" />
                        </svg>
                      </button>

                      {tOpen && (
                        <div className="mt-3 grid gap-2">
                          {(subsByTheme[t.code] ?? []).map(s => (
                            <div key={s.code} className="rounded-lg border px-3 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-badge-subtheme/10 text-badge-subtheme text-[10px] px-2 py-0.5">
                                  Subtheme
                                </span>
                                <span>{s.name}</span>
                              </div>
                              {role === 'super-admin' && (
                                <div className="text-xs text-slate-500">admin actions coming soon</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
