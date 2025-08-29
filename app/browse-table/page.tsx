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
type Row = {
  level: 'pillar' | 'theme' | 'subtheme' | 'standard'
  pillar?: Pillar
  theme?: Theme
  subtheme?: Subtheme
  standard?: Standard
  indicator_id?: string | null
  indicator_name?: string | null
  indicator_description?: string | null
  canAddOwnIndicator: boolean
}

export default function BrowseTablePage() {
  // ===== UI constants to keep look consistent =====
  const COLORS = {
    headerBorder: '#e5e7eb',
    textMuted: '#6b7280',
    chipBg: '#f3f4f6',
    rowP: 'rgba(240,236,232,0.6)',
    rowT: 'rgba(232,233,236,0.55)',
    rowS: 'rgba(233,240,248,0.55)',
  } as const
  const cell = { padding: '6px 8px', borderBottom: `1px solid ${COLORS.headerBorder}`, verticalAlign: 'top' } as React.CSSProperties
  const input = { width: '100%', padding: '6px 8px', border: `1px solid ${COLORS.headerBorder}`, borderRadius: 6, fontSize: 13 } as React.CSSProperties
  const textarea = { ...input, minHeight: 34, resize: 'vertical' as const }
  const chip = { padding: '0px 6px', borderRadius: 6, background: COLORS.chipBg, fontSize: 12 } as React.CSSProperties

  // ===== Supabase client (browser) =====
  const supabase = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(url, anon)
  }, [])

  const [loading, setLoading] = React.useState(false)
  const [rows, setRows] = React.useState<Row[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [editMode, setEditMode] = React.useState(false)
  const [form, setForm] = React.useState<Record<string, { name?: string; description?: string }>>({})

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
      if (e1 || e2 || e3 || e4 || e5) {
        throw new Error([e1?.message, e2?.message, e3?.message, e4?.message, e5?.message].filter(Boolean).join(' | '))
      }

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
    } catch (e: any) {
      setError(e.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => { load() }, [])

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

  async function addIndicatorForRow(r: Row) {
    try {
      const payload: any = {
        code: null,
        name: form['__new__']?.name || `Default indicator for ${r.subtheme?.name || r.theme?.name || r.pillar?.name || 'row'}`,
        description: form['__new__']?.description || '',
        is_default: true,
        weight: null, sort_order: 1,
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
      setForm(f => ({ ...f, ['__new__']: {} }))
      await load()
      alert('Indicator added')
    } catch (e: any) { alert('Add indicator failed: ' + e.message) }
  }

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

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto', fontSize: 14, lineHeight: 1.35 }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, background: 'white', zIndex: 10,
        paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${COLORS.headerBorder}`,
        display: 'flex', alignItems: 'center', gap: 12
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

      <p style={{ color: COLORS.textMuted, marginTop: 0, marginBottom: 8 }}>
        Read-only by default. Toggle <b>Edit mode</b> to edit indicator fields inline.
      </p>

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
            {rows.length === 0 && !loading && (
              <tr><td style={{ ...cell }} colSpan={editMode ? 7 : 6}><span style={{ color: COLORS.textMuted }}>No matching rows.</span></td></tr>
            )}

            {rows.map((r, idx) => {
              const bg =
                r.level === 'pillar' ? COLORS.rowP :
                r.level === 'theme' ? COLORS.rowT :
                r.level === 'subtheme' ? COLORS.rowS : 'transparent'
              const id = r.indicator_id || ''
              const draft = id ? form[id] : undefined

              return (
                <tr key={idx} style={{ background: bg }}>
                  <td style={cell}>{r.pillar && (<><span style={chip}>P</span> <span style={{ fontWeight: 600 }}>{r.pillar.name}</span></>)}</td>
                  <td style={cell}>{r.theme && (<><span style={chip}>T</span> {r.theme.name}</>)}</td>
                  <td style={cell}>{r.subtheme && (<><span style={chip}>ST</span> {r.subtheme.name}</>)}</td>
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
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                      {!id && r.canAddOwnIndicator ? (
                        <button
                          onClick={() => addIndicatorForRow(r)}
                          style={{ padding: '6px 8px', borderRadius: 8, border: `1px solid ${COLORS.headerBorder}`, background: '#f9fafb' }}
                        >
                          Add indicator
                        </button>
                      ) : <span style={{ color: COLORS.textMuted }}> </span>}
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
