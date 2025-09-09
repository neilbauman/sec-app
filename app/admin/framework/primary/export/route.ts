// app/admin/framework/primary/export/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'
import { getCurrentRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

function csvEscape(val: any) {
  const s = (val ?? '').toString()
  // escape quotes
  const q = s.replace(/"/g, '""')
  // wrap always for safety
  return `"${q}"`
}

export async function GET() {
  const role = await getCurrentRole()
  if (role !== 'super-admin') {
    return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })
  }

  const supabase = getServerClient()

  const { data: pillars, error: pErr } = await supabase
    .from('pillars')
    .select('code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)
  if (pErr) return NextResponse.json({ ok: false, message: pErr.message }, { status: 500 })

  const { data: themes, error: tErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)
  if (tErr) return NextResponse.json({ ok: false, message: tErr.message }, { status: 500 })

  const { data: subs, error: sErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)
  if (sErr) return NextResponse.json({ ok: false, message: sErr.message }, { status: 500 })

  // Combined format: level,code,parent_code,name,description,sort_order
  // parent_code = pillar_code (for themes) or theme_code (for subthemes). Empty for pillars.
  const rows: string[] = []
  rows.push(['level', 'code', 'parent_code', 'name', 'description', 'sort_order'].join(','))

  for (const p of pillars ?? []) {
    rows.push(
      [
        csvEscape('pillar'),
        csvEscape(p.code),
        csvEscape(''),
        csvEscape(p.name),
        csvEscape(p.description ?? ''),
        csvEscape(p.sort_order),
      ].join(',')
    )
  }
  for (const t of themes ?? []) {
    rows.push(
      [
        csvEscape('theme'),
        csvEscape(t.code),
        csvEscape(t.pillar_code),
        csvEscape(t.name),
        csvEscape(t.description ?? ''),
        csvEscape(t.sort_order),
      ].join(',')
    )
  }
  for (const s of subs ?? []) {
    rows.push(
      [
        csvEscape('subtheme'),
        csvEscape(s.code),
        csvEscape(s.theme_code),
        csvEscape(s.name),
        csvEscape(s.description ?? ''),
        csvEscape(s.sort_order),
      ].join(',')
    )
  }

  const body = rows.join('\r\n')
  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="ssc_primary_framework.csv"',
    },
  })
}
