'use client'

import * as React from 'react'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

type Props = {
  role?: AppRole
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

type Grouped = Record<string, Theme[]>
type GroupedSubs = Record<string, Subtheme[]>

export default function PrimaryFrameworkCards({ role, pillars, themes, subthemes }: Props) {
  // group themes by pillar
  const themesByPillar = React.useMemo(() => {
    const r: Grouped = {}
    for (const t of themes) (r[t.pillar_code] ??= []).push(t)
    for (const k in r) r[k].sort((a, b) => a.sort_order - b.sort_order)
    return r
  }, [themes])

  // group subthemes by theme
  const subsByTheme = React.useMemo(() => {
    const r: GroupedSubs = {}
    for (const st of subthemes) (r[st.theme_code] ??= []).push(st)
    for (const k in r) r[k].sort((a, b) => a.sort_order - b.sort_order)
    return r
  }, [subthemes])

  // expanded state per pillar/theme
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = React.useState<Record<string, boolean>>({})

  const canEdit = role === 'super-admin'
  const action = (msg: string) => () => {
    // placeholder—no DB writes yet
    window.alert(msg)
  }

  const PillarBadge = () => (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
      Pillar
    </span>
  )
  const ThemeBadge = () => (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      Theme
    </span>
  )
  const SubthemeBadge = () => (
    <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
      Subtheme
    </span>
  )

  const Chevron = ({ open }: { open: boolean }) => (
    <span className="inline-block h-5 w-5 rounded-md border border-slate-200 text-slate-600">
      <span className={`block translate-x-[6px] translate-y-[1px] transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
    </span>
  )

  const Actions = ({ level, code }: { level: 'pillar' | 'theme' | 'subtheme'; code: string }) =>
    canEdit ? (
      <div className="flex items-center gap-1">
        <button
          onClick={action(`Edit ${level} ${code} (placeholder)`)}
          title="Edit"
          className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
        >
          ✎
        </button>
        <button
          onClick={action(`Move up ${level} ${code} (placeholder)`)}
          title="Move up"
          className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
        >
          ↑
        </button>
        <button
          onClick={action(`Move down ${level} ${code} (placeholder)`)}
          title="Move down"
          className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
        >
          ↓
        </button>
        {level !== 'subtheme' && (
          <button
            onClick={action(`Add child under ${level} ${code} (placeholder)`)}
            title="Add child"
            className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
          >
            ＋
          </button>
        )}
        <button
          onClick={action(`Delete ${level} ${code} (placeholder)`)}
          title="Delete"
          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
        >
          🗑
        </button>
      </div>
    ) : null

  return (
    <div className="flex flex-col gap-4">
      {pillars
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => {
          const open = !!openPillars[p.code]
          const pillarThemes = themesByPillar[p.code] ?? []
          return (
            <section key={p.code} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-start justify-between gap-4 p-5">
                <div className="flex flex-1 items-start gap-3">
                  <button
                    onClick={() => setOpenPillars((s) => ({ ...s, [p.code]: !s[p.code] }))}
                    className="mt-0.5"
                    title={open ? 'Collapse' : 'Expand'}
                  >
                    <Chevron open={open} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <PillarBadge />
                      <span className="text-xs text-slate-400">[{p.code}]</span>
                    </div>
                    <h2 className="mt-1 text-lg font-medium text-slate-900">{p.name}</h2>
                    {p.description && <p className="mt-1 text-sm text-slate-600">{p.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">Sort {p.sort_order}</span>
                  <Actions level="pillar" code={p.code} />
                </div>
              </header>

              {open && pillarThemes.length > 0 && (
                <div className="border-t border-slate-100 p-5">
                  <div className="flex flex-col gap-3">
                    {pillarThemes.map((t) => {
                      const tOpen = !!openThemes[t.code]
                      const tSubs = subsByTheme[t.code] ?? []
                      return (
                        <div key={t.code} className="rounded-xl border border-slate-200 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-1 items-start gap-3">
                              <button
                                onClick={() => setOpenThemes((s) => ({ ...s, [t.code]: !s[t.code] }))}
                                className="mt-0.5"
                                title={tOpen ? 'Collapse' : 'Expand'}
                              >
                                <Chevron open={tOpen} />
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <ThemeBadge />
                                  <span className="text-xs text-slate-400">[{t.code}]</span>
                                </div>
                                <h3 className="mt-1 text-base font-medium text-slate-900">{t.name}</h3>
                                {t.description && <p className="mt-1 text-sm text-slate-600">{t.description}</p>}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs text-slate-400">Sort {t.sort_order}</span>
                              <Actions level="theme" code={t.code} />
                            </div>
                          </div>

                          {tOpen && tSubs.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {tSubs.map((st) => (
                                <div key={st.code} className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-3">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <SubthemeBadge />
                                      <span className="text-xs text-slate-400">[{st.code}]</span>
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-slate-900">{st.name}</div>
                                    {st.description && <p className="mt-1 text-sm text-slate-600">{st.description}</p>}
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">Sort {st.sort_order}</span>
                                    <Actions level="subtheme" code={st.code} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          )
        })}
    </div>
  )
}
