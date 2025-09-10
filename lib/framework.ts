// /lib/framework.ts
// Server-side helper to fetch the framework lists from Supabase and
// normalize them to the /types/framework.ts shapes.

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) {
    throw new Error('Missing Supabase env vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Fetches pillars, themes, subthemes and returns them normalized to the unified types.
 * - Ensures subthemes include `pillar_code` (derived via theme → pillar mapping if missing).
 */
export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = getSupabase();

  // Fetch raw rows (keep selection minimal & tolerant)
  const { data: pillarsRaw, error: pErr } = await supabase
    .from('pillars')
    .select('code,name,description,order_index')
    .order('order_index', { ascending: true });

  if (pErr) throw pErr;

  const { data: themesRaw, error: tErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,order_index')
    .order('order_index', { ascending: true });

  if (tErr) throw tErr;

  const { data: subthemesRaw, error: sErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,pillar_code,name,description,order_index')
    .order('order_index', { ascending: true });

  if (sErr) throw sErr;

  const pillars: Pillar[] = (pillarsRaw ?? []).map((p) => ({
    code: p.code,
    name: p.name,
    description: p.description ?? null,
    order_index: p.order_index ?? null,
  }));

  const themes: Theme[] = (themesRaw ?? []).map((t) => ({
    code: t.code,
    pillar_code: t.pillar_code, // required
    name: t.name,
    description: t.description ?? null,
    order_index: t.order_index ?? null,
  }));

  // Build a quick lookup from theme.code => pillar_code to backfill subthemes
  const themeToPillar = new Map<string, string>();
  for (const t of themes) themeToPillar.set(t.code, t.pillar_code);

  const subthemes: Subtheme[] = (subthemesRaw ?? []).map((s) => ({
    code: s.code,
    theme_code: s.theme_code,                  // required
    pillar_code: s.pillar_code || themeToPillar.get(s.theme_code) || '', // ensure present
    name: s.name,
    description: s.description ?? null,
    order_index: s.order_index ?? null,
  }));

  return { pillars, themes, subthemes };
}
