'use client'

import React from 'react'
import { createClient } from '@supabase/supabase-js'

type Pillar = { id: string; code: string; name: string; description: string | null; sort_order: number | null }
type Theme = { id: string; pillar_id: string; code: string; name: string; description: string | null; sort_order: number | null }
type Subtheme = { id: string; theme_id: string; code: string; name: string; description: string | null; sort_order: number | null }
type Standard = { id: string; subtheme_id: string; code: string | null; description: string; notes: string | null; sort_order: number | null }
type Indicator = {
  id: string
  code: string | null
  name: string
  description: string | null
  weight: number | null
  is_default: boolean
  sort_order: number | null
  pillar_id: string | null
  theme_id: string | null
  subtheme_id: string | null
  standard_id: string | null
}

type RowLevel = 'pillar' | 'theme' | 'subtheme' | 'standard'
type Row = {
  level: RowLevel
  pillar?: Pillar
  theme?: Theme
  subtheme?: Subtheme
  standard?: Standard
  indicator_id?: string | null
  indicator_name?: string | null
  indicator_description?: string | null
  canAddOwnIndicator: boolean
}

const COLORS = {
  headerBorder: '#e5e7eb',
  textMuted: '#6b7280',
  chipBg: '#f3f4f6',
  // subtle, complementary tints:
  rowP: 'rgba(241, 236, 231, 0.70)',   // Pillar
  rowT: 'rgba(232, 233, 238, 0.65)',   // Theme
  rowS: 'rgba(233, 240, 248, 0.65)',   // Sub-theme
} as const

const cell: React.CSSProperties = { padding: '6px 8px', borderBottom: `1px solid ${COLORS.headerBorder}`, verticalAlign: 'top' }
const input: React.CSSProperties = { width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.headerBorder}`, borderRadius: 6, fontSize: 13 }
const textarea: React.CSSProperties = { ...input, minHeight: 34, resize: 'vertical' as const }
const chip: React.CSSProperties = { padding: '0px 6px', borderRadius: 6, background: COLORS.chipBg, fontSize: 12 }

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M12.3 4.3l3.4 3.4-8.6 8.6H3.7v-3.4l8.6-8.6z" stroke="#374151" strokeWidth="1.5" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 6h8m-7 0v9a1 1 0 001 1h4a1 1 0 001-1V6M8 6V4a1 1 0 011-1h2a1 1 0 011 1v2M4 6h12" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4v12m6-6H4" stroke="#065f46" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .15s ease' }}>
      <path d="M7 5l6 5-6 5" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function BrowseTablePage() {
  // Supabase browser client
  const supabase = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(url, anon)
  }, [])

  // data state
  const [loading, setLoading] = React.useState(false)
  const [rows, setRows] = React.useState<Row[]>([])
  const [error, setError] = React.useState<string | null>(null)

  // UI state
  const [editMode, setEditMode] = React.useState(false)
  const [form, setForm] = React.useState<Record<string, { name?: string; description?: string }>>({})

  // collapse state
  const [collapsedPillars, setCollapsedPillars] = React.useState<Set<string>>(new Set())   // default collapsed after load
  const [collapsedThemes, setCollapsedThemes] = React.useState<Set<string>>(new Set())

  // filters
  const [filterPillar, setFilterPillar] = React.useState<string>('all')
  const [filterTheme, setFilterTheme] = React.useState<string>('all')
  const [filterSubtheme, setFilterSubtheme] = React.useState<string>('all')
  const [search, setSearch] = React.useState<string>('')

  // options for filters
  const [pillarsOpt, setPillarsOpt] = React.useState<Pillar[]>([])
  const [themesOpt, setThemesOpt] = React.useState<Theme[]>([])
  const [subthemesOpt, setSubthemesOpt] = React.useState<Subtheme[]>([])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [
        { data: pillars, error: e1 },
        { data: themes, error: e2 },
        { data: subthemes, error: e3 },
        { data: standards, error: e4 },
        { data: indicators, error: e5 },
      ] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
        supabase.from('standards').select('*').order('sort_order', { ascending: true }),
        supabase.from('indicators').select('*'),
      ])
      if (e1 || e2 || e3 || e4 || e5) throw new Error([e1?.message, e2?.message, e3?.message, e4?.message, e5?.message].filter(Boolean).join(' | '))

      setPillarsOpt(pillars || [])
      setThemesOpt(themes || [])
      setSubthemesOpt(subthemes || [])

      // groupings
      const themesByPillar = new Map<string, Theme[]>()
      themes!.forEach(t => themesByPillar.set(t.pillar_id, [...(themesByPillar.get(t.pillar_id) || []), t]))
      const subsByTheme = new Map<string, Subtheme[]>()
      subthemes!.forEach(s => subsByTheme.set(s.theme_id, [...(subsByTheme.get(s.theme_id) || []), s]))
      const stdsBySub = new Map<string, Standard[]>()
      standards!.forEach(d => stdsBySub.set(d.subtheme_id, [...(stdsBySub.get(d.subtheme_id) || []), d]))

      const indByPillar = new Map<string, Indicator[]>()
      const indByTheme = new Map<string, Indicator[]>()
      const indBySub = new Map<string, Indicator[]>()
      const indByStd = new Map<string, Indicator[]>()
      indicators!.forEach(i => {
        if (i.pillar_id) indByPillar.set(i.pillar_id, [...(indByPillar.get(i.pillar_id) || []), i])
        if (i.theme_id) indByTheme.set(i.theme_id, [...(indByTheme.get(i.theme_id) || []), i])
        if (i.subtheme_id) indBySub.set(i.subtheme_id, [...(indBySub.get(i.subtheme_id) || []), i])
        if (i.standard_id) indByStd.set(i.standard_id, [...(indByStd.get(i.standard_id) || []), i])
      })
      const pick = (xs?: Indicator[]) => (xs && xs.length ? (xs.find(x => x.is_default) || xs[0]) : undefined)

      const out: Row[] = []
      for (const p of (pillars || [])) {
        const pInd = pick(indByPillar.get(p.id))
        out.push({
          level: 'pillar', pillar: p,
          indicator_id: pInd?.id, indicator_name: pInd?.name ?? null, indicator_description: pInd?.description ?? null,
          canAddOwnIndicator: !pInd,
        })

        const tList = (themesByPillar.get(p.id) || []).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0))
        for (const t of tList) {
          const tInd = pick(indByTheme.get(t.id)) || pInd
          out.push({
            level: 'theme', pillar: p, theme: t,
            indicator_id: tInd?.id, indicator_name: tInd?.name ?? null, indicator_description: tInd?.description ?? null,
            canAddOwnIndicator: !pick(indByTheme.get(t.id)),
          })

          const sList = (subsByTheme.get(t.id) || []).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0))
          for (const s of sList) {
            const sInd = pick(indBySub.get(s.id)) || tInd || pInd
            const ds = (stdsBySub.get(s.id) || [])
            if (ds.length === 0) {
              out.push({
                level: 'subtheme', pillar: p, theme: t, subtheme: s,
                indicator_id: sInd?.id, indicator_name: sInd?.name ?? null, indicator_description: sInd?.description ?? null,
                canAddOwnIndicator: !pick(indBySub.get(s.id)),
              })
            } else {
              for (const d of ds.sort((a,b)=>(a.sort_order??0)-(b.sort_order??0))) {
                const dInd = pick(indByStd.get(d.id)) || sInd
                out.push({
                  level: 'standard', pillar: p, theme: t, subtheme: s, standard: d,
                  indicator_id: dInd?.id, indicator_name: dInd?.name ?? null, indicator_description: dInd?.description ?? null,
                  canAddOwnIndicator: !pick(indByStd.get(d.id)),
                })
              }
            }
          }
        }
      }
      setRows(out)

      // default collapsed: all pillars & themes
      setCollapsedPillars(new Set((pillars || []).map(p => p.id)))
      setCollapsedThemes(new Set((themes || []).map(t => t.id)))
    } catch (e: any) {
      setError(e.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => { load() }, [])

  // --------- API helpers
  async function apiUpdateIndicator(id: string, patch: any) {
    const res = await fetch(`/api/indicators/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || 'Update failed')
    }
    return res.json()
  }

  async function apiDeleteIndicator(id: string) {
    const res = await fetch(`/api/indicators/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || 'Delete failed')
    }
  }

  async function apiAddIndicatorForRow(r: Row) {
    const payload: any = {
      code: null,
      name: form['__new__']?.name || `Default indicator for ${r.subtheme?.name || r.theme?.name || r.pillar?.name || 'row'}`,
      description: form['__new__']?.description || '',
      is_default: true, weight: null, sort_order: 1,
    }
    if (r.level === 'pillar' && r.pillar) payload.pillar_id = r.pillar.id
    else if (r.level === 'theme' && r.theme) payload.theme_id = r.theme.id
    else if (r.level === 'subtheme' && r.subtheme) payload.subtheme_id = r.subtheme.id
    else if (r.level === 'standard' && r.standard) payload.standard_id = r.standard.id
    else throw new Error('Row has no target parent')
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j.error || 'Create failed')
    }
  }

  // --------- actions
  async function saveEdit() {
    try {
      const entries = Object.entries(form) as [string, { name?: string; description?: string }][]
      const toSave = entries.filter(([id]) => id !== '__new__' && id)
      for (const [id, vals] of toSave) {
        const patch: any = {}
        if (typeof vals.name !== 'undefined') patch.name = vals.name
        if (typeof vals.description !== 'undefined') patch.description = vals.description
        if (Object.keys(patch).length > 0) await apiUpdateIndicator(id, patch)
      }
      setForm({})
      await load()
      alert('Saved')
    } catch (e: any) { alert('Save failed: ' + e.message) }
  }

  // --------- render helpers
  const bgFor = (lvl: RowLevel) => (lvl === 'pillar' ? COLORS.rowP : lvl === 'theme' ? COLORS.rowT : lvl === 'subtheme' ? COLORS.rowS : 'transparent')

  const visible = (r: Row) => {
    // filter by dropdowns
    if (filterPillar !== 'all') {
      if (!r.pillar || r.pillar.id !== filterPillar) return false
    }
    if (filterTheme !== 'all') {
      if (!r.theme || r.theme.id !== filterTheme) return false
    }
    if (filterSubtheme !== 'all') {
      if (!r.subtheme || r.subtheme.id !== filterSubtheme) return false
    }
    // search across main text fields
    if (search.trim()) {
      const q = search.toLowerCase()
      const hay = [
        r.pillar?.name, r.theme?.name, r.subtheme?.name,
        r.standard?.description, r.indicator_name, r.indicator_description
      ].filter(Boolean).join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    // collapse logic
    if (r.level !== 'pillar' && r.pillar && collapsedPillars.has(r.pillar.id)) return false
    if ((r.level === 'subtheme' || r.level === 'standard') && r.theme && collapsedThemes.has(r.theme.id)) return false
    return true
  }

  // Pillar/Theme toggles
  const PToggle = ({ p }: { p: Pillar }) => {
    const open = !collapsedPillars.has(p.id)
    return (
      <button
        onClick={() => setCollapsedPillars(s => {
          const n = new Set(s)
          if (open) n.add(p.id); else n.delete(p.id) // toggle opposite
          return n
        })}
        title={open ? 'Collapse pillar' : 'Expand pillar'}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, marginRight: 6 }}
      >
        <IconChevron open={open} />
      </button>
    )
  }
  const TToggle = ({ t }: { t: Theme }) => {
    const open = !collapsedThemes.has(t.id)
    return (
      <button
        onClick={() => setCollapsedThemes(s => {
          const n = new Set(s)
          if (open) n.add(t.id); else n.delete(t.id)
          return n
        })}
        title={open ? 'Collapse theme' : 'Expand theme'}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, marginRight: 6 }}
      >
        <IconChevron open={open} />
      </button>
    )
  }

  // Filter option lists
  const pillarOpts = [{ id: 'all', name: 'All Pillars' as any } as Pillar].concat(pillarsOpt)
  const themeOpts = [{ id: 'all', name: 'All Themes', pillar_id: '' } as any as Theme].concat(
    filterPillar === 'all' ? themesOpt : themesOpt.filter(t => t.pillar_id === filterPillar)
  )
  const subthemeOpts = [{ id: 'all', name: 'All Sub-themes', theme_id: '' } as any as Subtheme].concat(
    filterTheme === 'all' ? subthemesOpt : subthemesOpt.filter(s => s.theme_id === filterTheme)
  )

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto', fontSize: 14, lineHeight: 1.35 }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, background: 'white', zIndex: 10,
        paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${COLORS.headerBorder}`,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'
      }}>
        <a href="/" style={{ textDecoration: 'none', color: '#4f46e5' }}>← Back to Home</a>
        <h1 style={{ fontSize: 20, margin: 0 }}>Framework Table</h1>
        <div style={{ flex: 1 }} />
        <a href="/api/export" style={{ color: '#4f46e5', textDecoration: 'none' }}>Download CSV</a>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.textMuted }}>
          <input type="checkbox" checked={editMode} onChange={e=>setEditMode(e.target.checked)} />
          Edit mode
        </label>
        {editMode && <button onClick={saveEdit} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb' }}>Save</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Search (pillar, theme, sub-theme, standard, indicator)…"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ ...input, maxWidth: 520 }}
        />
        <select value={filterPillar} onChange={e => { setFilterPillar(e.target.value); setFilterTheme('all'); setFilterSubtheme('all') }} style={{ ...input, maxWidth: 160 }}>
          {pillarOpts.map(p => <option key={p.id} value={p.id}>{p.id==='all' ? 'All Pillars' : p.name}</option>)}
        </select>
        <select value={filterTheme} onChange={e => { setFilterTheme(e.target.value); setFilterSubtheme('all') }} style={{ ...input, maxWidth: 160 }}>
          {themeOpts.map(t => <option key={t.id} value={t.id}>{t.id==='all' ? 'All Themes' : t.name}</option>)}
        </select>
        <select value={filterSubtheme} onChange={e => setFilterSubtheme(e.target.value)} style={{ ...input, maxWidth: 170 }}>
          {subthemeOpts.map(s => <option key={s.id} value={s.id}>{s.id==='all' ? 'All Sub-themes' : s.name}</option>)}
        </select>
        <button onClick={()=>{ setCollapsedPillars(new Set()); setCollapsedThemes(new Set()) }} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb' }}>Expand all</button>
        <button onClick={()=>{ setCollapsedPillars(new Set(pillarsOpt.map(p=>p.id))); setCollapsedThemes(new Set(themesOpt.map(t=>t.id))) }} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb' }}>Collapse all</button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#fbfbfb' }}>
              <th style={{ ...cell }}>Pillar</th>
              <th style={{ ...cell }}>Theme</th>
              <th style={{ ...cell }}>Sub-theme</th>
              <th style={{ ...cell, width: 320 }}>Standard Description</th>
              <th style={{ ...cell, width: 260 }}>Indicator Name</th>
              <th style={{ ...cell, width: 320 }}>Indicator Description</th>
              {editMode && <th style={{ ...cell, width: 120 }}></th>}
            </tr>
          </thead>
          <tbody>
            {rows.filter(visible).map((r, idx) => {
              const bg = bgFor(r.level)
              const id = r.indicator_id || ''
              const draft = id ? form[id] : undefined
              return (
                <tr key={idx} style={{ background: bg }}>
                  {/* Pillar cell with toggle */}
                  <td style={cell}>
                    {r.pillar && (
                      <>
                        <PToggle p={r.pillar} />
                        <span style={chip}>P</span> <span style={{ fontWeight: 600 }}>{r.pillar.name}</span>
                      </>
                    )}
                  </td>
                  {/* Theme cell with toggle */}
                  <td style={cell}>
                    {r.theme && (
                      <>
                        <TToggle t={r.theme} />
                        <span style={chip}>T</span> {r.theme.name}
                      </>
                    )}
                  </td>
                  <td style={cell}>
                    {r.subtheme && (<><span style={chip}>ST</span> {r.subtheme.name}</>)}
                  </td>
                  <td style={cell}>{r.standard?.description ?? ''}</td>

                  {/* Indicator name */}
                  <td style={cell}>
                    {editMode && id ? (
                      <input
                        style={input}
                        value={draft?.name ?? r.indicator_name ?? ''}
                        onChange={e => setForm(f => ({ ...f, [id]: { ...(f[id] || {}), name: e.target.value } }))}
                        placeholder="Indicator name"
                      />
                    ) : (
                      r.indicator_name || <span style={{ color: COLORS.textMuted }}>—</span>
                    )}
                  </td>

                  {/* Indicator description */}
                  <td style={cell}>
                    {editMode && id ? (
                      <textarea
                        style={textarea}
                        rows={2}
                        value={draft?.description ?? r.indicator_description ?? ''}
                        onChange={e => setForm(f => ({ ...f, [id]: { ...(f[id] || {}), description: e.target.value } }))}
                        placeholder="Indicator description"
                      />
                    ) : (
                      r.indicator_description || <span style={{ color: COLORS.textMuted }}>—</span>
                    )}
                  </td>

                  {editMode && (
                    <td style={{ ...cell, whiteSpace: 'nowrap', display: 'flex', gap: 8 }}>
                      {!id && r.canAddOwnIndicator ? (
                        <button onClick={() => apiAddIndicatorForRow(r).then(load).catch(e=>alert(e.message))}
                          title="Add indicator"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 8, border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb' }}>
                          <IconPlus /> Add
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => apiUpdateIndicator(id, form[id] || {}).then(load).catch(e=>alert(e.message))}
                            title="Save this indicator"
                            style={{ border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb', borderRadius: 8, padding: 6 }}
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => confirm('Delete indicator from this row?') && apiDeleteIndicator(id).then(load).catch(e=>alert(e.message))}
                            title="Delete this indicator"
                            style={{ border: `1px solid ${COLORS.headerBorder}`, background: '#fff5f5', borderRadius: 8, padding: 6 }}
                          >
                            <IconTrash />
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
