// components/PrimaryFrameworkCards.tsx
'use client'

import { useMemo, useState } from 'react'
import type { AppRole } from '@/lib/role'

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
  // start collapsed by default
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({})

  const tByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {}
    for (const t of themes) {
      (map[t.pillar_code] ||= []).push(t)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.sort_order - b.sort_order)
    return map
  }, [themes])

  const stByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {}
    for (const s of subthemes) {
      (map[s.theme_code] ||= []).push(s)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.sort_order - b.sort_order)
    return map
  }, [subthemes])

  const sortedPillars = useMemo(
    () => [...pillars].sort((a, b) => a.sort_order - b.sort_order),
    [pillars]
  )

  return (
    <div className="space-y-4">
      {sortedPillars.map((p) => {
        const pillarOpen = !!openPillars[p.code]
        const pThemes = tByPillar[p.code] || []
        return (
          <div key={p.code} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 p-4">
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"
                title="Pillar"
              >
                P
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">{p.code}</div>
                    <div className="text-lg font-semibold text-slate-900">{p.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenPillars((s) => ({ ...s, [p.code]: !pillarOpen }))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    {pillarOpen ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                {p.description ? (
                  <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                ) : null}
                <div className="mt-2 text-xs text-slate-500">Sort: {p.sort_order}</div>
              </div>
            </div>

            {pillarOpen && (
              <div className="border-t border-slate-100">
                {pThemes.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">No themes.</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {pThemes.map((t) => {
                      const themeOpen = !!openThemes[t.code]
                      const tSubs = stByTheme[t.code] || []
                      return (
                        <li key={t.code}>
                          <div className="flex items-start gap-3 p-4">
                            <span
                              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"
                              title="Theme"
                            >
                              T
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-[11px] text-slate-500">{t.code}</div>
                                  <div className="font-medium text-slate-900">{t.name}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOpenThemes((s) => ({ ...s, [t.code]: !themeOpen }))}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm hover:bg-slate-50"
                                >
                                  {themeOpen ? 'Collapse' : 'Expand'}
                                </button>
                              </div>
                              {t.description ? (
                                <p className="mt-1 text-sm text-slate-600">{t.description}</p>
                              ) : null}
                              <div className="mt-2 text-xs text-slate-500">Sort: {t.sort_order}</div>
                            </div>
                          </div>

                          {themeOpen && (
                            <div className="border-t border-slate-100 bg-slate-50/60">
                              {tSubs.length === 0 ? (
                                <div className="p-4 text-sm text-slate-500">No sub-themes.</div>
                              ) : (
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="text-xs uppercase tracking-wide text-slate-500">
                                      <th className="px-4 py-2 w-14">Tag</th>
                                      <th className="px-2 py-2 w-28">Code</th>
                                      <th className="px-2 py-2">Name</th>
                                      <th className="px-2 py-2">Description</th>
                                      <th className="px-2 py-2 w-24">Sort</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {tSubs.map((s) => (
                                      <tr key={s.code} className="align-top">
                                        <td className="px-4 py-2">
                                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-700 text-[10px] font-semibold">
                                            ST
                                          </span>
                                        </td>
                                        <td className="px-2 py-2 text-xs text-slate-500">{s.code}</td>
                                        <td className="px-2 py-2 text-slate-900">{s.name}</td>
                                        <td className="px-2 py-2 text-slate-700 text-sm">
                                          {s.description || <span className="text-slate-400">—</span>}
                                        </td>
                                        <td className="px-2 py-2 text-xs text-slate-500">{s.sort_order}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* Read-only banner */}
            <div className="border-t border-slate-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
              Role: <span className="font-medium">{role}</span> · Read-only preview
            </div>
          </div>
        )
      })}
    </div>
  )
}
