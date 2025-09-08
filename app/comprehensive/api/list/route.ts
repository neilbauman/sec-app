// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, status: 401, message }, { status: 401 });
}

function checkAuth(req: Request) {
  const expected = process.env.INTERNAL_API_TOKEN || '';
  const got = req.headers.get('x-internal-token') || '';
  if (!expected || got !== expected) return false;
  return true;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const supabase = getServerClient();

  // 1) Always fetch the Primary framework
  const primary = {
    pillars: [] as any[],
    themes: [] as any[],
    subthemes: [] as any[],
    counts: { pillars: 0, themes: 0, subthemes: 0 },
  };

  {
    const { data, error } = await supabase
      .from('pillars')
      .select('code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      primary.pillars = data;
      primary.counts.pillars = data.length;
    }
  }

  {
    const { data, error } = await supabase
      .from('themes')
      .select('code,pillar_code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      primary.themes = data;
      primary.counts.themes = data.length;
    }
  }

  {
    const { data, error } = await supabase
      .from('subthemes')
      .select('code,theme_code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      primary.subthemes = data;
      primary.counts.subthemes = data.length;
    }
  }

  // 2) Try to fetch the comprehensive bits; if any fail, return fallback based on Primary
  const tryCount = async (table: string) => {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    } catch {
      return null; // signal failure
    }
  };

  const indicatorsCount = await tryCount('indicators');
  const levelsCount = await tryCount('levels');   // if you haven’t created it yet, this returns null
  const criteriaCount = await tryCount('criteria'); // if not created yet, returns null

  if (
    indicatorsCount === null ||
    levelsCount === null ||
    criteriaCount === null
  ) {
    // Fallback: emit standards (pillar/theme/subtheme combos) only
    const standards = primary.subthemes.map((st) => {
      const theme = primary.themes.find((t) => t.code === st.theme_code);
      const pillar = primary.pillars.find((p) => p.code === theme?.pillar_code);
      return {
        pillar_code: pillar?.code || null,
        pillar_name: pillar?.name || null,
        theme_code: theme?.code || null,
        theme_name: theme?.name || null,
        subtheme_code: st?.code || null,
        subtheme_name: st?.name || null,
      };
    });

    return NextResponse.json({
      ok: true,
      mode: 'fallback-primary-only',
      counts: {
        pillars: primary.counts.pillars,
        themes: primary.counts.themes,
        subthemes: primary.counts.subthemes,
        standards: standards.length,
      },
      standards,
    });
  }

  // If we got here, all 3 comprehensive tables exist and we can return counts
  return NextResponse.json({
    ok: true,
    mode: 'full',
    counts: {
      pillars: primary.counts.pillars,
      themes: primary.counts.themes,
      subthemes: primary.counts.subthemes,
      indicators: indicatorsCount,
      levels: levelsCount,
      criteria: criteriaCount,
    },
  });
}
