// app/framework/FrameworkTree.tsx
'use client'

import { useState } from 'react'

type Pillar = {
  code: string
  name: string | null
  description: string | null
  sort_order: number | null
}
type Theme = {
  code: string
  pillar_code: string | null
  name: string | null
  description: string | null
  sort_order: number | null
}
type Subtheme = {
  code: string
  theme_code: string | null
  name: string | null
  description: string | null
  sort_order: number | null
}

export default function FrameworkTree({
  pillars,
  themes,
  subthemes,
}: {
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}) {
  // Track which pillar/theme rows are expanded (by code)
  const [openPillars, setOpenPillars] = useState<Set<string>>(new Set())
  const [openThemes, setOpenThemes] = useState<Set<string>>(new Set())

  const togglePillar = (code: string) => {
    setOpenPillars((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const toggleTheme = (code: string) => {
    setOpenThemes((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  // group themes by pillar_code
  const themesByPillar = new Map<string, Theme[]>()
  for (const t of themes) {
    const pc = t.pillar_code ?? ''
    if (!themesByPillar.has(pc)) themesByPillar.set(pc, [])
    themesByPillar.get(pc)!.push(t)
  }

  // group subthemes by theme_code
  const subthemesByTheme = new Map<string, Subtheme[]>()
  for (const st of subthemes) {
    const tc = st.theme_code ?? ''
    if (!subthemesByTheme.has(tc)) subthemesByTheme.set(tc, [])
    subthemesByTheme.get(tc)!.push(st)
  }

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {pillars.map((p) => {
        const tForP = themesByPillar.get(p.code) ?? []
        const isOpen = openPillars.has(p.code)
        return (
          <div key={p.code} className="px-4 py-3">
            <div className="flex items-start justify-between">
              <button
                type="button"
                onClick={() => togglePillar(p.code)}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-gray-50"
                aria-expanded={isOpen}
              >
                <Caret open={isOpen} />
                <span className="inline-flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {p.code}
                  </span>
                  <span className="text-sm font-medium">{p.name ?? 'Untitled Pillar'}</span>
                </span>
              </button>

              <span className="text-xs text-gray-500">{tForP.length} theme(s)</span>
            </div>

            {p.description ? (
              <p className="ml-7 mt-1 text-xs text-gray-500">{p.description}</p>
            ) : null}

            {isOpen && tForP.length > 0 && (
              <div className="ml-7 mt-3 space-y-3 border-l-2 border-gray-200 pl-3">
                {tForP.map((t) => {
                  const stForT = subthemesByTheme.get(t.code) ?? []
                  const tOpen = openThemes.has(t.code)
                  return (
                    <div key={t.code}>
                      <div className="flex items-start justify-between">
                        <button
                          type="button"
                          onClick={() => toggleTheme(t.code)}
                          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-gray-50"
                          aria-expanded={tOpen}
                        >
                          <Caret open={tOpen} size="sm" />
                          <span className="inline-flex items-center gap-2">
                            <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">
                              {t.code}
                            </span>
                            <span className="text-sm">{t.name ?? 'Untitled Theme'}</span>
                          </span>
                        </button>

                        <span className="text-[11px] text-gray-500">{stForT.length} subtheme(s)</span>
                      </div>

                      {t.description ? (
                        <p className="ml-6 mt-1 text-xs text-gray-500">{t.description}</p>
                      ) : null}

                      {tOpen && stForT.length > 0 && (
                        <div className="ml-6 mt-2 space-y-1 border-l-2 border-dashed border-gray-200 pl-3">
                          {stForT.map((st) => (
                            <div key={st.code} className="flex items-start gap-2">
                              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-gray-300" />
                              <span className="inline-flex items-center gap-2">
                                <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-800">
                                  {st.code}
                                </span>
                                <span className="text-sm">{st.name ?? 'Untitled Subtheme'}</span>
                              </span>
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

      {pillars.length === 0 && (
        <div className="p-6 text-sm text-gray-500">No framework records found.</div>
      )}
    </div>
  )
}

function Caret({ open, size = 'md' }: { open: boolean; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  return (
    <svg
      className={`${s} transition-transform ${open ? 'rotate-90' : ''} text-gray-600`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
