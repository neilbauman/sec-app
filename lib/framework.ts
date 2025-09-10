// lib/framework.ts
import { createClient } from '@supabase/supabase-js';

export type Pillar = {
  code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type Subtheme = {
  code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon);
}

/**
 * fetchFrameworkList
 * Reads pillars → themes → subthemes with simple .select()s, ordered for display.
 * No RPCs, no auth — uses anon key + RLS read-only policies.
 */
export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = supabaseServer();

  const [{ data: pillars, error: pillarsErr }, { data: themes, error: themesErr }, { data: subthemes, error: subthemesErr }] =
    await Promise.all([
      supabase.from('pillars')
        .select('code,name,description,sort_order')
        .order('sort_order', { ascending: true, nullsFirst: true })
        .order('name', { ascending: true }),
      supabase.from('themes')
        .select('code,pillar_code,name,description,sort_order')
        .order('sort_order', { ascending: true, nullsFirst: true })
        .order('name', { ascending: true }),
      supabase.from('subthemes')
        .select('code,theme_code,name,description,sort_order')
        .order('sort_order', { ascending: true, nullsFirst: true })
        .order('name', { ascending: true }),
    ]);

  if (pillarsErr) throw new Error(`Supabase pillars error: ${pillarsErr.message}`);
  if (themesErr) throw new Error(`Supabase themes error: ${themesErr.message}`);
  if (subthemesErr) throw new Error(`Supabase subthemes error: ${subthemesErr.message}`);

  return {
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
