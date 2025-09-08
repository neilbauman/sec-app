'use client'

import { useEffect, useState } from 'react'

type Pillar = { code: string; name?: string; description?: string; sort_order?: number }
type Theme = { code: string; pillar_code: string; name?: string; description?: string; sort_order?: number }
type Subtheme = { code: string; theme_code: string; name?: string; description?: string; sort_order?: number }

export default function FrameworkClient() {
  const [pillars, setPillars] = useState<Pillar[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [subs, setSubs] = useState<Subtheme[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/framework/api/list', { cache: 'no-store' })
        const data = await res.json()
        if (!alive) return
        setPillars((data.pillars ?? []).sort((a: Pillar, b: Pillar) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
        setThemes((data.themes ?? []).sort((a: Theme, b: Theme) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
        setSubs((data.subthemes ?? []).sort((a: Subtheme, b: Subtheme) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
      } catch (e: any) {
        setErr(e?.message || 'Failed to load framework')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const themesByPillar = new Map<string, Theme[]>()
  themes.forEach(t => {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  })

  const subsByTheme = new Map<string, Subtheme[]>()
  subs.forEach(s => {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  })

  return (
    <div className="page">
      <h1 className="h1">Primary Framework Editor</h1>
      <p className="lead">Read-only view for now. Expand/collapse to browse pillars, themes, and sub-themes.</p>

      <div className="meta section">
        <strong>Pillars</strong> {pillars.length} &middot; <strong>Themes</strong> {themes.length} &middot{' '}
        <strong>Sub-themes</strong> {subs.length}
      </div>

      {err && <p className="meta">Error: {err}</p>}
      {loading && <p className="meta">Loading…</p>}

      <div className="stack section">
        {pillars.map(p => {
          const tlist = (themesByPillar.get(p.code) ?? [])
          return (
            <details key={p.code} className="details">
              <summary>
                {p.code ? `${p.code} ` : ''}{p.name || 'Untitled Pillar'}
                <span className="badge">{tlist.length} theme{tlist.length === 1 ? '' : 's'}</span>
              </summary>
              <div className="content">
                {p.description && <p className="meta" style={{ marginBottom: '.5rem' }}>{p.description}</p>}

                <div className="kids">
                  {tlist.length === 0 && <p className="meta">No themes.</p>}

                  {tlist.map(t => {
                    const slist = subsByTheme.get(t.code) ?? []
                    return (
                      <details key={t.code} className="details">
                        <summary>
                          {t.code ? `${t.code} ` : ''}{t.name || 'Untitled Theme'}
                          <span className="badge">{slist.length} subtheme{slist.length === 1 ? '' : 's'}</span>
                        </summary>
                        <div className="content">
                          {t.description && <p className="meta" style={{ marginBottom: '.5rem' }}>{t.description}</p>}

                          <div className="kids">
                            {slist.length === 0 && <p className="meta">No sub-themes.</p>}
                            {slist.map(s => (
                              <div key={s.code} className="details" style={{ padding: '.6rem .8rem', background: '#fff' }}>
                                <div style={{ fontWeight: 600 }}>
                                  {s.code ? `${s.code} ` : ''}{s.name || 'Untitled Sub-theme'}
                                </div>
                                {s.description && <div className="meta" style={{ marginTop: '.25rem' }}>{s.description}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
