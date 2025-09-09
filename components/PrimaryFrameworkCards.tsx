// components/PrimaryFrameworkCards.tsx
'use client'

import { useMemo, useState } from 'react'
import type { AppRole } from '@/lib/role'
import { ChevronRight, ChevronDown } from 'lucide-react'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

type Props = {
  role: AppRole
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

/** small colored tag for pillar/theme labels */
function Tag({ text }: { text: string }) {
  // deterministic color by text hash
  const hue = useMemo(() => {
    let h = 0
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360
    return h
  }, [text])
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: `hsl(${hue} 70% 94%)`,
        color: `hsl(${hue} 55% 30%)`,
        border: `1px solid hsl(${hue} 45% 85%)`,
      }}
    >
      {text}
    </span>
  )
}

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({})

  // Index themes by pillar
  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {}
    for (const t of themes) {
      const key = t.pillar_code ?? ''
      if (!m[key]) m[key] = []
      m[key].push(t)
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [themes])

  // Index subthemes by theme
  const subthemesByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {}
    for (const s of subthemes) {
      const key = s.theme_code ?? ''
      if (!m[key]) m[key] = []
      m[key].push(s)
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return m
  }, [subthemes])

  const togglePillar = (code: string) =>
    setOpenPillars(prev => ({ ...prev, [code]: !prev[code] }))

  const toggleTheme = (code: string) =>
    setOpenThemes(prev => ({ ...prev, [code]: !prev[code] }))

  return (
    <div className="space-y-4">
      {pillars
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map(p => {
          const isOpen = !!openPillars[p.code]
          const pillarThemes = themesByPillar[p.code] ?? []

          return (
            <div
              key={p.code}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => togglePillar(p.code)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <span className="mt-0.5">
                  {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{p.name}</h3>
                    <Tag text={p.code} />
                  </div>
                  {p.description ? (
                    <p className="text-sm text-slate-600 mt-0.5">{p.description}</p>
                  ) : null}
                </div>
              </button>

              {isOpen && (
                <div className="divide-y">
                  {pillarThemes.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">No themes</div>
                  ) : (
                    pillarThemes.map(t => {
                      const tOpen = !!openThemes[t.code]
                      const items = subthemesByTheme[t.code] ?? []

                      return (
                        <div key={t.code} className="px-4">
                          <button
                            type="button"
                            onClick={() => toggleTheme(t.code)}
                            className="w-full flex items-start gap-3 py-3 hover:bg-slate-50"
                          >
                            <span className="mt-0.5">
                              {tOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">{t.name}</h4>
                                <Tag text={t.code} />
                              </div>
                              {t.description ? (
                                <p className="text-[13px] text-slate-600 mt-0.5">{t.description}</p>
                              ) : null}
                            </div>
                          </button>

                          {tOpen && (
                            <div className="pb-3">
                              {items.length === 0 ? (
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                  No subthemes
                                </div>
                              ) : (
                                <ul className="grid gap-2">
                                  {items.map(s => (
                                    <li
                                      key={s.code}
                                      className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">{s.name}</div>
                                        <Tag text={s.code} />
                                      </div>
                                      {s.description ? (
                                        <p className="text-[13px] text-slate-600 mt-1">
                                          {s.description}
                                        </p>
                                      ) : null}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
