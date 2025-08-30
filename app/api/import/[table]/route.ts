import Papa from 'papaparse'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

type TableName = 'pillars' | 'themes' | 'subthemes' | 'standards' | 'indicators'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { table: TableName } }
) {
  // simple upload form for convenience
  const url = new URL(req.url)
  const mode = url.searchParams.get('mode') ?? 'upsert'
  const html = /* html */ `
    <html><body style="font-family: ui-sans-serif, system-ui; padding: 24px">
      <h2>Import CSV → ${params.table}</h2>
      <form method="POST" enctype="multipart/form-data" action="?mode=${mode}">
        <input type="file" name="file" accept=".csv" required />
        <button type="submit">Upload (${mode})</button>
      </form>
      <p style="margin-top:12px">Add <code>?mode=replace</code> to wipe the table first; default is <code>upsert</code>.</p>
    </body></html>
  `
  return new NextResponse(html, { headers: { 'content-type': 'text/html' } })
}

export async function POST(
  req: Request,
  { params }: { params: { table: TableName } }
) {
  const table = params.table
  if (!['pillars','themes','subthemes','standards','indicators'].includes(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 })
  }

  const url = new URL(req.url)
  const mode = (url.searchParams.get('mode') ?? 'upsert') as 'upsert' | 'replace'

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const text = await file.text()
  const parsed = Papa.parse<Record<string,string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })
  if (parsed.errors?.length) {
    return NextResponse.json({ error: 'CSV parse error', details: parsed.errors }, { status: 400 })
  }
  const rows = parsed.data

  const supabase = createClient()

  // For "replace", wipe the table first
  if (mode === 'replace') {
    const { error: delErr } = await supabase.from(table).delete().neq('id', '')
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  }

  // Normalize/route per table
  // We upsert on "code" if present, else plain insert.
  const onConflict = 'code'

  let { error, data }:
    { error: any; data: any } = { error: null, data: null }

  if (table === 'pillars') {
    data = rows.map(r => ({
      id: r.id?.trim() || undefined,
      code: r.code?.trim() || null,
      name: r.name?.trim() || null,
      description: r.description ?? null,
      sort_order: r.sort_order ? Number(r.sort_order) : null,
    }))
    const q = supabase.from('pillars')
    ;({ error } = mode === 'upsert'
      ? await q.upsert(data, { onConflict })
      : await q.insert(data))
  }

  if (table === 'themes') {
    data = rows.map(r => ({
      id: r.id?.trim() || undefined,
      code: r.code?.trim() || null,
      pillar_id: r.pillar_id?.trim() || null,
      pillar_code: r.pillar_code?.trim() || null,
      name: r.name?.trim() || null,
      description: r.description ?? null,
      sort_order: r.sort_order ? Number(r.sort_order) : null,
    }))
    // Resolve pillar_code → pillar_id if provided
    if (data.some((d: any) => !d.pillar_id && d.pillar_code)) {
      const codes = Array.from(new Set(data.map((d: any) => d.pillar_code).filter(Boolean)))
      if (codes.length) {
        const { data: pillars, error: pe } = await supabase.from('pillars').select('id,code').in('code', codes)
        if (pe) return NextResponse.json({ error: pe.message }, { status: 500 })
        const map = new Map(pillars.map(p => [p.code, p.id]))
        data.forEach((d: any) => { if (!d.pillar_id && d.pillar_code) d.pillar_id = map.get(d.pillar_code) ?? null })
      }
    }
    data.forEach((d: any) => delete d.pillar_code)
    const q = supabase.from('themes')
    ;({ error } = mode === 'upsert'
      ? await q.upsert(data, { onConflict })
      : await q.insert(data))
  }

  if (table === 'subthemes') {
    data = rows.map(r => ({
      id: r.id?.trim() || undefined,
      code: r.code?.trim() || null,
      theme_id: r.theme_id?.trim() || null,
      theme_code: r.theme_code?.trim() || null,
      name: r.name?.trim() || null,
      description: r.description ?? null,
      sort_order: r.sort_order ? Number(r.sort_order) : null,
    }))
    if (data.some((d: any) => !d.theme_id && d.theme_code)) {
      const codes = Array.from(new Set(data.map((d: any) => d.theme_code).filter(Boolean)))
      if (codes.length) {
        const { data: themes, error: te } = await supabase.from('themes').select('id,code').in('code', codes)
        if (te) return NextResponse.json({ error: te.message }, { status: 500 })
        const map = new Map(themes.map(t => [t.code, t.id]))
        data.forEach((d: any) => { if (!d.theme_id && d.theme_code) d.theme_id = map.get(d.theme_code) ?? null })
      }
    }
    data.forEach((d: any) => delete d.theme_code)
    const q = supabase.from('subthemes')
    ;({ error } = mode === 'upsert'
      ? await q.upsert(data, { onConflict })
      : await q.insert(data))
  }

  if (table === 'standards') {
    data = rows.map(r => ({
      id: r.id?.trim() || undefined,
      code: r.code?.trim() || null,
      subtheme_id: r.subtheme_id?.trim() || null,
      subtheme_code: r.subtheme_code?.trim() || null,
      description: r.description ?? null,
      notes: r.notes ?? null,
      sort_order: r.sort_order ? Number(r.sort_order) : null,
    }))
    if (data.some((d: any) => !d.subtheme_id && d.subtheme_code)) {
      const codes = Array.from(new Set(data.map((d: any) => d.subtheme_code).filter(Boolean)))
      if (codes.length) {
        const { data: sts, error: se } = await supabase.from('subthemes').select('id,code').in('code', codes)
        if (se) return NextResponse.json({ error: se.message }, { status: 500 })
        const map = new Map(sts.map(s => [s.code, s.id]))
        data.forEach((d: any) => { if (!d.subtheme_id && d.subtheme_code) d.subtheme_id = map.get(d.subtheme_code) ?? null })
      }
    }
    data.forEach((d: any) => delete d.subtheme_code)
    const q = supabase.from('standards')
    ;({ error } = mode === 'upsert'
      ? await q.upsert(data, { onConflict })
      : await q.insert(data))
  }

  if (table === 'indicators') {
    data = rows.map(r => ({
      id: r.id?.trim() || undefined,
      code: r.code?.trim() || null,
      // One of these can be provided (code takes priority):
      pillar_code: r.pillar_code?.trim() || null,
      theme_code: r.theme_code?.trim() || null,
      subtheme_code: r.subtheme_code?.trim() || null,
      standard_code: r.standard_code?.trim() || null,
      pillar_id: r.pillar_id?.trim() || null,
      theme_id: r.theme_id?.trim() || null,
      subtheme_id: r.subtheme_id?.trim() || null,
      standard_id: r.standard_id?.trim() || null,
      name: r.name?.trim() || null,
      description: r.description ?? null,
      is_default: typeof r.is_default === 'string' ? /^t|true|1$/i.test(r.is_default) : !!r.is_default,
      weight: r.weight ? Number(r.weight) : null,
      sort_order: r.sort_order ? Number(r.sort_order) : null,
    }))

    // Resolve any *_code→*_id
    async function fill(table: string, codeKey: string, idKey: string) {
      const needed = Array.from(new Set(data.map((d: any) => d[codeKey]).filter(Boolean)))
      if (!needed.length) return
      const { data: look, error: le } = await supabase.from(table).select('id,code').in('code', needed)
      if (le) throw new Error(le.message)
      const map = new Map(look.map((x: any) => [x.code, x.id]))
      data.forEach((d: any) => { if (!d[idKey] && d[codeKey]) d[idKey] = map.get(d[codeKey]) ?? null })
    }
    try {
      await fill('pillars','pillar_code','pillar_id')
      await fill('themes','theme_code','theme_id')
      await fill('subthemes','subtheme_code','subtheme_id')
      await fill('standards','standard_code','standard_id')
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
    data.forEach((d: any) => { delete d.pillar_code; delete d.theme_code; delete d.subtheme_code; delete d.standard_code })

    const q = supabase.from('indicators')
    ;({ error } = mode === 'upsert'
      ? await q.upsert(data, { onConflict })
      : await q.insert(data))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ table, mode, rows: rows.length, ok: true })
}
