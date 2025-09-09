// components/PrimaryFrameworkCards.tsx
'use client'

import * as React from 'react'
import type { AppRole } from '@/lib/role'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Plus, Tag, Trash2 } from 'lucide-react'

type Pillar =  { code: string; name: string; description?: string; sort_order: number }
type Theme =   { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme ={ code: string; theme_code: string; name: string; description?: string; sort_order: number }

type Props = {
  role: AppRole
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  // Group on the client (props are JSON-safe)
  const themesByPillar = React.useMemo(() => {
    const r: Record<string, Theme[]> = {}
    for (const t of themes) (r[t.pillar_code] ??= []).push(t)
    for (const k in r) r[k].sort((a,b)=>a.sort_order-b.sort_order)
    return r
  }, [themes])

  const subsByTheme = React.useMemo(() => {
    const r: Record<string, Subtheme[]> = {}
    for (const s of subthemes) (r[s.theme_code] ??= []).push(s)
    for (const k in r) r[k].sort((a,b)=>a.sort_order-b.sort_order)
    return r
  }, [subthemes])

  // Collapse state
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes]   = React.useState<Record<string, boolean>>({})

  const canEdit = role === 'super-admin'

  return (
    <div className="space-y-6">
      {pillars
        .slice()
        .sort((a,b)=>a.sort_order-b.sort_order)
        .map((p) => {
          const isOpen = openPillars[p.code] ?? true
          return (
            <div key={p.code} className="rounded-2xl border bg-white shadow-sm">
              {/* Pillar header */}
              <div className="flex items-start justify-between p-4">
                <div className="flex items-start gap-3">
                  <button
                    aria-label={isOpen ? 'Collapse pillar' : 'Expand pillar'}
                    className="rounded-full border p-1 hover:bg-gray-50"
                    onClick={() => setOpenPillars(s => ({...s, [p.code]: !isOpen}))}
                  >
                    {isOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5">Pillar</span>
                      <span className="text-xs text-slate-500">[P{p.sort_order}]</span>
                    </div>
                    <h2 className="font-semibold text-lg mt-1">{p.name}</h2>
                    {p.description && <p className="text-slate-600 text-sm mt-1">{p.description}</p>}
                  </div>
                </div>
                <div className="text-xs text-slate-500">Sort {p.sort_order}</div>
              </div>

              {/* Pillar actions */}
              <div className="flex items-center gap-2 px-4 pb-3">
                {canEdit && (
                  <>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Tag"><Tag size={14}/></button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Move up"><ArrowUp size={14}/></button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Move down"><ArrowDown size={14}/></button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Add"><Plus size={14}/></button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Delete"><Trash2 size={14}/></button>
                  </>
                )}
              </div>

              {/* Themes list */}
              {isOpen && (
                <div className="divide-y">
                  {(themesByPillar[p.pillar_code ?? p.code] ?? []).map((t) => {
                    const tOpen = openThemes[t.code] ?? true
                    return (
                      <div key={t.code} className="px-4 py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <button
                              aria-label={tOpen ? 'Collapse theme' : 'Expand theme'}
                              className="rounded-full border p-1 hover:bg-gray-50 mt-0.5"
                              onClick={() => setOpenThemes(s => ({...s, [t.code]: !tOpen}))}
                            >
                              {tOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">Theme</span>
                                <span className="text-xs text-slate-500">[T{t.sort_order}]</span>
                              </div>
                              <div className="font-medium mt-0.5">{t.name}</div>
                              {t.description && <div className="text-slate-600 text-sm">{t.description}</div>}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">Sort {t.sort_order}</div>
                        </div>

                        {/* Theme actions */}
                        {canEdit && (
                          <div className="flex items-center gap-2 mt-2">
                            <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Tag"><Tag size={14}/></button>
                            <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Move up"><ArrowUp size={14}/></button>
                            <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Move down"><ArrowDown size={14}/></button>
                            <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Add"><Plus size={14}/></button>
                            <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Delete"><Trash2 size={14}/></button>
                          </div>
                        )}

                        {/* Subthemes */}
                        {tOpen && (
                          <div className="mt-3 pl-7 space-y-2">
                            {(subsByTheme[t.code] ?? []).map((s) => (
                              <div key={s.code} className="rounded-lg border p-3 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5">Subtheme</span>
                                    </div>
                                    <div className="font-medium mt-0.5">{s.name}</div>
                                    {s.description && <div className="text-slate-600 text-sm">{s.description}</div>}
                                  </div>
                                </div>
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
