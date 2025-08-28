'use client'

import React from 'react'
import { createClient } from '@/lib/supabaseClient'

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
  // hierarchy context
  level: 'pillar' | 'theme' | 'subtheme' | 'standard'
  pillar?: Pillar
  theme?: Theme
  subtheme?: Subtheme
  standard?: Standard

  // the indicator actually shown for this row (could be at this level or inherited from a parent)
  indicator_id?: string | null
  indicator_name?: string | null
  indicator_description?: string | null

  // whether this row HAS its own indicator (vs. inheriting from a parent)
  canAddOwnIndicator: boolean
}

export default function BrowseTablePage() {
  const supabase = React.useMemo(() => createClient(), [])
  const [loading, setLoading] = React.useState(false)
  const [rows, setRows] = React.useState<Row[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [editMode, setEditMode] = React.useState(false)

  // draft edits keyed by indicator_id
  const [form, setForm] = React.useState<Record<string, { name?: string; description?: string }>>({})

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [{ data: pillars, error: e1 }, { data: themes, error: e2 }, { data: subthemes, error: e3 }, { data: standards, error: e4 }, { data: indicators, error: e5 }] =
        await Promise.all([
          supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
          supabase.from('themes').select('*').order('sort_order', { ascending: true }),
          supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
          supabase.from('standards').select('*').order('sort_order', { ascending: true }),
          supabase.from('indicators').select('*'),
        ])

      if (e1 || e2 || e3 || e4 || e5) throw new Error([e1?.message, e2?.message, e3?.message, e4?.message, e5?.message].filter(Boolean).join(' | '))

      // group helpers
      const themesByPillar = new Map<string, Theme[]>()
      themes!.forEach(t => {
        const arr = themesByPillar.get(t.pillar_id) || []
        arr.push(t)
        themesByPillar.set(t.pillar_id, arr)
      })

      const subsByTheme = new Map<string, Subtheme[]>()
      subthemes!.forEach(s => {
        const arr = subsByTheme.get(s.theme_id) || []
        arr.push(s)
        subsByTheme.set(s.theme_id, arr)
      })

      const stdsBySub = new Map<string, Standard[]>()
      standards!.forEach(d => {
        const arr = stdsBySub.get(d.subtheme_id) || []
        arr.push(d)
        stdsBySub.set(d.subtheme_id, arr)
      })

      const indByPillar = new Map<string, Indicator[]>()
      const indByTheme = new Map<string, Indicator[]>()
      const indBySub = new Map<string, Indicator[]>()
      const indByStd = new Map<string, Indicator[]>()
      indicators!.forEach(i => {
        if (i.pillar_id) indByPillar.set(i.pillar_id, (indByPillar.get(i.pillar_id) || []).concat(i))
        if (i.theme_id) indByTheme.set(i.theme_id, (indByTheme.get(i.theme_id) || []).concat(i))
        if (i.subtheme_id) indBySub.set(i.subtheme_id, (indBySub.get(i.subtheme_id) || []).concat(i))
        if (i.standard_id) indByStd.set(i.standard_id, (indByStd.get(i.standard_id) || []).concat(i))
      })

      // helper: pick default indicator from a list (prefer is_default, else first)
      const pick = (list?: Indicator[]) => (list && list.length ? (list.find(x => x.is_default) || list[0]) : undefined)

      const out: Row[] = []
      // Pillars in order
      for (const p of (pillars || [])) {
        const pInd = pick(indByPillar.get(p.id))
        out.push({
          level: 'pillar',
          pillar: p,
          indicator_id: pInd?.id,
          indicator_name: pInd?.name ?? null,
          indicator_description: pInd?.description ?? null,
          canAddOwnIndicator: !pInd, // allow add if none exists at pillar
        })

        const tList = (themesByPillar.get(p.id) || []).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        for (const t of tList) {
          const tInd = pick(indByTheme.get(t.id)) || pInd
          out.push({
            level: 'theme',
            pillar: p,
            theme: t,
            indicator_id: tInd?.id,
            indicator_name: tInd?.name ?? null,
            indicator_description: tInd?.description ?? null,
            canAddOwnIndicator: !pick(indByTheme.get(t.id)), // only if there is no theme-level indicator yet
          })

          const sList = (subsByTheme.get(t.id) || []).sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          for (const s of sList) {
            const sInd = pick(indBySub.get(s.id)) || tInd || pInd
            // if subtheme has no standards, render a subtheme row itself
            const ds = (stdsBySub.get(s.id) || [])
            if (ds.length === 0) {
              out.push({
                level: 'subtheme',
                pillar: p,
                theme: t,
                subtheme: s,
                indicator_id: sInd?.id,
                indicator_name: sInd?.name ?? null,
                indicator_description: sInd?.description ?? null,
                canAddOwnIndicator: !pick(indBySub.get(s.id)),
              })
            } else {
              for (const d of ds.sort((a,b)=> (a.sort_order ?? 0) - (b.sort_order ?? 0))) {
                const dInd = pick(indByStd.get(d.id)) || sInd
                out.push({
                  level: 'standard',
                  pillar: p,
                  theme: t,
                  subtheme: s,
                  standard: d,
                  indicator_id: dInd?.id,
                  indicator_name: dInd?.name ?? null,
                  indicator_description: dInd?.description ?? null,
                  canAddOwnIndicator: !pick(indByStd.get(d.id)),
                })
              }
            }
          }
        }
      }

      setRows(out)
    } catch (err: any) {
      setError(err.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { load() }, []) // initial load

  async function updateIndicator(id: string, patch: any) {
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
        weight: null,
        sort_order: 1,
      }
      if (r.level === 'pillar' && r.pillar) payload.pillar_id = r.pillar.id
      else if (r.level === 'theme' && r.theme) payload.theme_id = r.theme.id
      else if (r.level === 'subtheme' && r.subtheme) payload.subtheme_id = r.subtheme.id
      else if (r.level === 'standard' && r.standard) payload.standard_id = r.standard.id
      else throw new Error('Row has no target parent')

      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Create failed')
      }
      setForm(f => ({ ...f, ['__new__']: {} }))
      await load()
      alert('Indicator added')
    } catch (e: any) {
      alert('Add indicator failed: ' + e.message)
    }
  }

  async function saveEdit() {
    try {
      const entries = Object.entries(form) as [string, { name?: string; description?: string }][]
      const toSave = entries.filter(([id]) => id !== '__new__' && id) // exclude "new" scratchpad

      for (const [id, vals] of toSave) {
        const patch: any = {}
        if (typeof vals.name !== 'undefined') patch.name = vals.name
        if (typeof vals.description !== 'undefined') patch.description = vals.description
        if (Object.keys(patch).length > 0) {
          await updateIndicator(id, patch)
        }
      }
      setForm({})
      await load()
      alert('Saved')
    } catch (e: any) {
      alert('Save failed: ' + e.message)
    }
  }

  const headerLink: React.CSSProperties = { textDecoration: 'none', color: '#5b21b6' }
  const chip: React.CSSProperties = { padding: '2px 6px', borderRadius: 6, background: '#f3f4f6' }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <a href="/" style={headerLink}>← Back to Home</a>
        <div style={{ flex: 1 }} />
        <a href="/api/export">Download CSV</a>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={editMode} onChange={(e)=>setEditMode(e.target.checked)} />
          Edit mode
        </label>
        {editMode && (
          <button onClick={saveEdit} style={{ padding: '6px 10px' }}>Save</button>
        )}
      </div>

      <h1 style={{ fontSize: 22, marginBottom: 10 }}>Framework Table</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>Read-only by default. Toggle <span style={{ fontWeight: 600 }}>Edit mode</span> to edit indicator fields inline.</p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Pillar</th>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Theme</th>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Sub-theme</th>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Standard Description</th>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Indicator Name</th>
              <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>Indicator Description</th>
              {editMode && <th style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}></th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr><td colSpan={editMode ? 7 : 6} style={{ padding: 12, opacity: 0.6 }}>No matching rows.</td></tr>
            )}

            {rows.map((r, idx) => {
              const bg =
                r.level === 'pillar' ? 'rgba(240,236,232,0.6)' :
                r.level === 'theme' ? 'rgba(232,233,236,0.55)' :
                r.level === 'subtheme' ? 'rgba(233,240,248,0.55)' :
                'transparent'

              const id = r.indicator_id || ''
              const draft = id ? form[id] : undefined

              return (
                <tr key={idx} style={{ background: bg }}>
                  <td style={{ padding: 8 }}>
                    {r.pillar ? (<><span style={chip}>P</span> {r.pillar.name}</>) : null}
                  </td>
                  <td style={{ padding: 8 }}>
                    {r.theme ? (<><span style={chip}>T</span> {r.theme.name}</>) : null}
                  </td>
                  <td style={{ padding: 8 }}>
                    {r.subtheme ? (<><span style={chip}>ST</span> {r.subtheme.name}</>) : null}
                  </td>
                  <td style={{ padding: 8 }}>
                    {r.standard?.description ?? ''}
                  </td>

                  {/* Indicator name */}
                  <td style={{ padding: 8, minWidth: 220 }}>
                    {editMode && id ? (
                      <input
                        style={{ width: '100%' }}
                        value={draft?.name ?? r.indicator_name ?? ''}
                        onChange={(e) =>
                          setForm(f => ({ ...f, [id]: { ...(f[id] || {}), name: e.target.value } }))
                        }
                        placeholder="Indicator name"
                      />
                    ) : (
                      r.indicator_name || <span style={{ opacity: 0.5 }}>—</span>
                    )}
                  </td>

                  {/* Indicator description */}
                  <td style={{ padding: 8, minWidth: 280 }}>
                    {editMode && id ? (
                      <textarea
                        rows={2}
                        style={{ width: '100%' }}
                        value={draft?.description ?? r.indicator_description ?? ''}
                        onChange={(e) =>
                          setForm(f => ({ ...f, [id]: { ...(f[id] || {}), description: e.target.value } }))
                        }
                        placeholder="Indicator description"
                      />
                    ) : (
                      r.indicator_description || <span style={{ opacity: 0.5 }}>—</span>
                    )}
                  </td>

                  {/* Actions */}
                  {editMode && (
                    <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                      {!id && r.canAddOwnIndicator ? (
                        <button onClick={() => addIndicatorForRow(r)}>Add indicator</button>
                      ) : (
                        <span style={{ opacity: 0.6 }}> </span>
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
