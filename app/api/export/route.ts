// app/api/export/route.ts
import { createClient } from '@/lib/supabaseServer';

type Pillar = { id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string|null; description: string; notes?: string|null; sort_order: number|null; };
type Indicator = {
  id: string; code?: string|null; name: string; description?: string|null; weight?: number|null;
  pillar_id?: string|null; theme_id?: string|null; subtheme_id?: string|null; standard_id?: string|null;
  is_default: boolean; sort_order: number|null;
};

const so = (n: number|null|undefined) => (n ?? 999999);
const bySoThenCode = <T extends { sort_order: number|null; code?: string|null }>(a: T, b: T) =>
  so(a.sort_order) - so(b.sort_order) || (a.code || '').localeCompare(b.code || '', undefined, { numeric: true });

const esc = (v: unknown) => {
  const s = v == null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(_req: Request) {
  const supabase = createClient();

  // 1) Load everything
  const [{ data: pillars, error: e1 }, { data: themes, error: e2 }, { data: subs, error: e3 }, { data: stds, error: e4 }, { data: inds, error: e5 }] =
    await Promise.all([
      supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('themes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('subthemes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('standards').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
      supabase.from('indicators').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true }),
    ]);

  if (e1 || e2 || e3 || e4 || e5) {
    const msg = (e1||e2||e3||e4||e5)?.message || 'Failed to load data';
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // Safety (types)
  const P = (pillars || []) as Pillar[];
  const T = (themes || []) as Theme[];
  const S = (subs || []) as Subtheme[];
  const D = (stds || []) as Standard[];
  const I = (inds || []) as Indicator[];

  // 2) Index for quick lookups
  const themesByPillar = new Map<string, Theme[]>();
  for (const t of T) themesByPillar.set(t.pillar_id, [ ...(themesByPillar.get(t.pillar_id) || []), t ]);
  for (const [k, arr] of themesByPillar) arr.sort(bySoThenCode);

  const subsByTheme = new Map<string, Subtheme[]>();
  for (const s of S) subsByTheme.set(s.theme_id, [ ...(subsByTheme.get(s.theme_id) || []), s ]);
  for (const [k, arr] of subsByTheme) arr.sort(bySoThenCode);

  const stdsBySub = new Map<string, Standard[]>();
  for (const d of D) stdsBySub.set(d.subtheme_id, [ ...(stdsBySub.get(d.subtheme_id) || []), d ]);
  for (const [k, arr] of stdsBySub) arr.sort(bySoThenCode);

  const indsByStd = new Map<string, Indicator[]>();
  for (const ind of I) {
    if (ind.standard_id) {
      indsByStd.set(ind.standard_id, [ ...(indsByStd.get(ind.standard_id) || []), ind ]);
    }
  }
  for (const [k, arr] of indsByStd) arr.sort(bySoThenCode);

  // Default indicators per level (by parent id)
  const defIndByPillar = new Map<string, Indicator>();
  const defIndByTheme  = new Map<string, Indicator>();
  const defIndBySub    = new Map<string, Indicator>();
  for (const ind of I) {
    if (ind.is_default && ind.pillar_id && !defIndByPillar.has(ind.pillar_id)) defIndByPillar.set(ind.pillar_id, ind);
    if (ind.is_default && ind.theme_id  && !defIndByTheme.has(ind.theme_id))   defIndByTheme.set(ind.theme_id, ind);
    if (ind.is_default && ind.subtheme_id && !defIndBySub.has(ind.subtheme_id)) defIndBySub.set(ind.subtheme_id, ind);
  }

  // 3) Build CSV rows mirroring your table view layout:
  // Columns: Pillar, Theme, Sub-theme, Standard Description, Indicator Name, Indicator Description
  const lines: string[] = [];
  lines.push(['Pillar', 'Theme', 'Sub-theme', 'Standard Description', 'Indicator Name', 'Indicator Description'].map(esc).join(','));

  // Framework-ordered traversal: pillar -> theme -> sub-theme -> standards -> indicators
  for (const p of P) {
    const pDef = defIndByPillar.get(p.id);
    lines.push([
      p.name,               // Pillar
      '',                   // Theme
      '',                   // Sub-theme
      p.description ?? '',  // Standard Description column shows parent description for summary rows
      pDef?.name ?? '',
      pDef?.description ?? ''
    ].map(esc).join(','));

    const themes = themesByPillar.get(p.id) || [];
    for (const t of themes) {
      const tDef = defIndByTheme.get(t.id);
      lines.push([
        '',                  // Pillar
        t.name,              // Theme
        '',                  // Sub-theme
        t.description ?? '',
        tDef?.name ?? '',
        tDef?.description ?? ''
      ].map(esc).join(','));

      const subs = subsByTheme.get(t.id) || [];
      for (const s of subs) {
        const sDef = defIndBySub.get(s.id);
        // Sub-theme summary row
        lines.push([
          '',                // Pillar
          '',                // Theme
          s.name,            // Sub-theme
          s.description ?? '',
          sDef?.name ?? '',
          sDef?.description ?? ''
        ].map(esc).join(','));

        // Standards (each with zero/one/many indicators)
        const stdsForSub = stdsBySub.get(s.id) || [];
        for (const d of stdsForSub) {
          const indicators = indsByStd.get(d.id) || [];
          if (indicators.length === 0) {
            lines.push([
              '', '', s.name,
              d.description || '',
              '',
              ''
            ].map(esc).join(','));
          } else {
            for (const ind of indicators) {
              lines.push([
                '', '', s.name,
                d.description || '',
                ind.name || '',
                ind.description || ''
              ].map(esc).join(','));
            }
          }
        }
      }
    }
  }

  // BOM for Excel-friendly CSV
  const csv = '\uFEFF' + lines.join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ssc_framework.csv"',
      'Cache-Control': 'no-store',
    }
  });
}
