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

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({})

  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {}
    for (const t of themes) {
      if (!map[t.pillar_code]) map[t.pillar_code] = []
      map[t.pillar_code].push(t)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return map
  }, [themes])

  const subsByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {}
    for (const s of subthemes) {
      if (!map[s.theme_code]) map[s.theme_code] = []
      map[s.theme_code].push(s)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return map
  }, [subthemes])

  // Default collapsed
  return (
    <div className="space-y-4">
      {pillars
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((p) => {
          const isOpen = openPillars[p.code] ?? false
          return (
            <div key={p.code} className="rounded-2xl border shadow-sm bg-white">
              <button
                type="button"
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                onClick={() => setOpenPillars((o) => ({ ...o, [p.code]: !isOpen }))}
              >
                {isOpen ? <ChevronDown className="mt-1" /> : <ChevronRight className="mt-1" />}
                <div className="grow text-left">
                  <div className="text-xs font-mono text-slate-500">PILLAR • {p.code}</div>
                  <div className="font-semibold">{p.name}</div>
                  {p.description && <div className="text-sm text-slate-600">{p.description}</div>}
                </div>
                <div className="shrink-0 text-xs rounded-full px-2 py-1 bg-slate-100 text-slate-700">
                  {themesByPillar[p.code]?.length ?? 0} themes
                </div>
              </button>

              {isOpen && (
                <div className="divide-y">
                  {(themesByPillar[p.code] ?? []).map((t) => {
                    const tOpen = openThemes[t.code] ?? false
                    return (
                      <div key={t.code} className="px-4 py-3">
                        <button
                          type="button"
                          className="w-full flex items-start gap-3"
                          onClick={() => setOpenThemes((o) => ({ ...o, [t.code]: !tOpen }))}
                        >
                          {tOpen ? <ChevronDown className="mt-1" /> : <ChevronRight className="mt-1" />}
                          <div className="grow text-left">
                            <div className="text-xs font-mono text-slate-500">THEME • {t.code}</div>
                            <div className="font-medium">{t.name}</div>
                            {t.description && <div className="text-sm text-slate-600">{t.description}</div>}
                          </div>
                          <div className="shrink-0 text-xs rounded-full px-2 py-1 bg-slate-100 text-slate-700">
                            {subsByTheme[t.code]?.length ?? 0} subthemes
                          </div>
                        </button>

                        {tOpen && (
                          <div className="mt-3 space-y-2">
                            {(subsByTheme[t.code] ?? []).map((s) => (
                              <div key={s.code} className="rounded-lg border px-3 py-2 bg-slate-50">
                                <div className="text-xs font-mono text-slate-500">SUBTHEME • {s.code}</div>
                                <div className="font-normal">{s.name}</div>
                                {s.description && <div className="text-sm text-slate-600">{s.description}</div>}
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
    </div>
  )
}
