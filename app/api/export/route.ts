// app/api/export/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function csvEscape(s: any) {
  if (s === null || s === undefined) return '';
  const str = String(s);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET() {
  // Load all tables
  const [pillars, themes, subs, stds, inds] = await Promise.all([
    db.from('pillars').select('*'),
    db.from('themes').select('*'),
    db.from('subthemes').select('*'),
    db.from('standards').select('*'),
    db.from('indicators').select('*'),
  ]);

  const perr = pillars.error || themes.error || subs.error || stds.error || inds.error;
  if (perr) return NextResponse.json({ error: perr.message }, { status: 500 });

  const p = pillars.data || [];
  const t = themes.data || [];
  const s = subs.data || [];
  const d = stds.data || [];
  const i = inds.data || [];

  // index by id for lookups
  const pById: Record<string, any> = Object.fromEntries(p.map((x: any) => [x.id, x]));
  const tById: Record<string, any> = Object.fromEntries(t.map((x: any) => [x.id, x]));
  const sById: Record<string, any> = Object.fromEntries(s.map((x: any) => [x.id, x]));

  // Build rows:
  // One row per Standard; also include rows for Pillar/Theme/Sub-theme that don't have standards
  const header = [
    'pillar_code','pillar_name','pillar_statement','pillar_description','pillar_sort',
    'theme_code','theme_name','theme_statement','theme_description','theme_sort',
    'subtheme_code','subtheme_name','subtheme_statement','subtheme_description','subtheme_sort',
    'standard_code','standard_statement','standard_notes','standard_sort',
    'indicator_code','indicator_name','indicator_description','indicator_weight','indicator_parent_level','indicator_is_default','indicator_sort'
  ];

  const lines: string[] = [];
  lines.push(header.join(','));

  // Helper to push a line
  function pushLine(row: Record<string, any>) {
    lines.push(header.map(h => csvEscape(row[h] ?? '')).join(','));
  }

  // Build a mapping of indicators by parent
  const indByParent = {
    pillar: new Map<string, any[]>(),
    theme: new Map<string, any[]>(),
    subtheme: new Map<string, any[]>(),
    standard: new Map<string, any[]>(),
  };
  for (const ind of i) {
    const level = ind.standard_id ? 'standard'
      : ind.subtheme_id ? 'subtheme'
      : ind.theme_id ? 'theme'
      : ind.pillar_id ? 'pillar'
      : null;
    if (!level) continue;
    const key = ind[`${level}_id`];
    const arr = indByParent[level].get(key) || [];
    arr.push(ind);
    indByParent[level].set(key, arr);
  }

  // For each pillar -> themes -> subthemes -> standards: output standard rows.
  for (const pillar of p.sort(sortBy('sort_order','code'))) {
    const pillarThemes = t.filter(x => x.pillar_id === pillar.id).sort(sortBy('sort_order','code'));
    const pillarInds = indByParent.pillar.get(pillar.id) || [];

    if (pillarThemes.length === 0) {
      // No themes; still output at least one row for this pillar
      if (pillarInds.length) {
        for (const ind of pillarInds) {
          pushLine({
            pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
            indicator_code: ind.code, indicator_name: ind.name, indicator_description: ind.description, indicator_weight: ind.weight,
            indicator_parent_level: 'pillar', indicator_is_default: ind.is_default, indicator_sort: ind.sort_order
          });
        }
      } else {
        pushLine({
          pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
        });
      }
      continue;
    }

    for (const theme of pillarThemes) {
      const themeSubs = s.filter(x => x.theme_id === theme.id).sort(sortBy('sort_order','code'));
      const themeInds = indByParent.theme.get(theme.id) || [];

      if (themeSubs.length === 0) {
        if (themeInds.length) {
          for (const ind of themeInds) {
            pushLine({
              pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
              theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
              indicator_code: ind.code, indicator_name: ind.name, indicator_description: ind.description, indicator_weight: ind.weight,
              indicator_parent_level: 'theme', indicator_is_default: ind.is_default, indicator_sort: ind.sort_order
            });
          }
        } else {
          pushLine({
            pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
            theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
          });
        }
        continue;
      }

      for (const sub of themeSubs) {
        const subStds = d.filter(x => x.subtheme_id === sub.id).sort(sortBy('sort_order','code'));
        const subInds = indByParent.subtheme.get(sub.id) || [];

        if (subStds.length === 0) {
          if (subInds.length) {
            for (const ind of subInds) {
              pushLine({
                pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
                theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
                subtheme_code: sub.code, subtheme_name: sub.name, subtheme_statement: sub.statement, subtheme_description: sub.description, subtheme_sort: sub.sort_order,
                indicator_code: ind.code, indicator_name: ind.name, indicator_description: ind.description, indicator_weight: ind.weight,
                indicator_parent_level: 'subtheme', indicator_is_default: ind.is_default, indicator_sort: ind.sort_order
              });
            }
          } else {
            pushLine({
              pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
              theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
              subtheme_code: sub.code, subtheme_name: sub.name, subtheme_statement: sub.statement, subtheme_description: sub.description, subtheme_sort: sub.sort_order,
            });
          }
          continue;
        }

        for (const std of subStds) {
          const stdInds = indByParent.standard.get(std.id) || [];
          if (stdInds.length) {
            for (const ind of stdInds) {
              pushLine({
                pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
                theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
                subtheme_code: sub.code, subtheme_name: sub.name, subtheme_statement: sub.statement, subtheme_description: sub.description, subtheme_sort: sub.sort_order,
                standard_code: std.code, standard_statement: std.statement, standard_notes: std.notes, standard_sort: std.sort_order,
                indicator_code: ind.code, indicator_name: ind.name, indicator_description: ind.description, indicator_weight: ind.weight,
                indicator_parent_level: 'standard', indicator_is_default: ind.is_default, indicator_sort: ind.sort_order
              });
            }
          } else {
            pushLine({
              pillar_code: pillar.code, pillar_name: pillar.name, pillar_statement: pillar.statement, pillar_description: pillar.description, pillar_sort: pillar.sort_order,
              theme_code: theme.code, theme_name: theme.name, theme_statement: theme.statement, theme_description: theme.description, theme_sort: theme.sort_order,
              subtheme_code: sub.code, subtheme_name: sub.name, subtheme_statement: sub.statement, subtheme_description: sub.description, subtheme_sort: sub.sort_order,
              standard_code: std.code, standard_statement: std.statement, standard_notes: std.notes, standard_sort: std.sort_order,
            });
          }
        }
      }
    }
  }

  const csv = lines.join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ssc_framework_export.csv"',
      'Cache-Control': 'no-store'
    }
  });
}

function sortBy(a: string, b: string) {
  return (x: any, y: any) => {
    const ax = x?.[a] ?? 999999, ay = y?.[a] ?? 999999;
    if (ax !== ay) return ax - ay;
    const bx = String(x?.[b] ?? ''), by = String(y?.[b] ?? '');
    return bx.localeCompare(by, undefined, { numeric: true });
  };
}
