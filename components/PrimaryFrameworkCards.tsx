'use client'

import * as React from 'react'

type Pillar   = { code: string; name: string; description?: string; sort_order: number }
type Theme    = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string;  name: string; description?: string; sort_order: number }

export default function PrimaryFrameworkCards(props: {
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}) {
  const { pillars, themes, subthemes } = props

  // Build groupings on the client (keep props JSON-safe)
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

  // Collapsed by default; remember in localStorage
  const [openP, setOpenP] = React.useState<Record<string, boolean>>({})
  const [openT, setOpenT] = React.useState<Record<string, boolean>>({})

  React.useEffect(()=>{ try {
    const p = localStorage.getItem('cards_openP'); const t = localStorage.getItem('cards_openT')
    if (p) setOpenP(JSON.parse(p)); if (t) setOpenT(JSON.parse(t))
  } catch{} },[])
  React.useEffect(()=>{ try {
    localStorage.setItem('cards_openP', JSON.stringify(openP))
    localStorage.setItem('cards_openT', JSON.stringify(openT))
  } catch{} },[openP, openT])

  const toggleP = (c:string)=> setOpenP(s=>({...s,[c]:!s[c]}))
  const toggleT = (c:string)=> setOpenT(s=>({...s,[c]:!s[c]}))

  return (
    <div className="space-y-5">
      {pillars
        .slice()
        .sort((a,b)=>a.sort_order-b.sort_order)
        .map(p => {
          const isOpen = !!openP[p.code]
          const tlist = themesByPillar[p.code] ?? []

          return (
            <section key={p.code} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Pillar header */}
              <header className="flex items-start justify-between gap-4 p-5">
                <div className="flex items-start gap-3">
                  <ChevronButton open={isOpen} onClick={()=>toggleP(p.code)} label="Toggle pillar" />
                  <div className="mt-0.5 flex items-center gap-2">
                    <LevelChip color="blue" text="Pillar" />
                    <CodeTiny>{p.code}</CodeTiny>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-6 text-gray-900">{p.name}</h2>
                    {p.description ? <p className="mt-0.5 text-sm text-gray-700">{p.description}</p> : null}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Sort {p.sort_order}</div>
              </header>

              {/* Themes */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {tlist.length === 0 ? (
                    <div className="p-5 text-sm text-gray-500">No themes.</div>
                  ) : (
                    tlist.map(t => {
                      const tOpen = !!openT[t.code]
                      const slist = subsByTheme[t.code] ?? []

                      return (
                        <article key={t.code} className="border-b last:border-b-0 border-gray-100">
                          <div className="flex items-start justify-between gap-4 p-5">
                            <div className="flex items-start gap-3">
                              <div className="ml-8">
                                <ChevronButton open={tOpen} onClick={()=>toggleT(t.code)} label="Toggle theme" />
                              </div>
                              <div className="mt-0.5 flex items-center gap-2">
                                <LevelChip color="green" text="Theme" />
                                <CodeTiny>{t.code}</CodeTiny>
                              </div>
                              <div>
                                <h3 className="font-medium leading-6 text-gray-900">{t.name}</h3>
                                {t.description ? <p className="mt-0.5 text-sm text-gray-700">{t.description}</p> : null}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Sort {t.sort_order}</div>
                          </div>

                          {/* Subthemes */}
                          {tOpen && (
                            <div className="pl-20 pb-4">
                              {slist.length === 0 ? (
                                <div className="px-4 pb-3 text-sm text-gray-500">No subthemes.</div>
                              ) : (
                                <ul className="space-y-2">
                                  {slist.map(s => (
                                    <li key={s.code} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5 flex items-center gap-2">
                                            <LevelChip color="red" text="Subtheme" />
                                            <CodeTiny>{s.code}</CodeTiny>
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">{s.name}</div>
                                            {s.description ? (
                                              <div className="mt-0.5 text-sm text-gray-700">{s.description}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Sort {s.sort_order}</div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </article>
                      )
                    })
                  )}
                </div>
              )}
            </section>
          )
        })}
    </div>
  )
}

/* ---------- Small presentational helpers ---------- */

function ChevronButton({
  open, onClick, label,
}: { open:boolean; onClick:()=>void; label:string }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      type="button"
    >
      {/* crisp SVG chevron, rotates when open */}
      <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 5l6 5-6 5V5z" />
      </svg>
    </button>
  )
}

function LevelChip({ color, text }: { color:'blue'|'green'|'red'; text:string }) {
  const styles =
    color === 'blue'  ? 'bg-blue-100 text-blue-700 border-blue-200' :
    color === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-red-100 text-red-700 border-red-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles}`}>
      {text}
    </span>
  )
}

function CodeTiny({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-gray-500">[{children}]</span>
}
