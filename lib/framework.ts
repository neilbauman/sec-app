// lib/framework.ts
// Server-side helpers to fetch the Primary Framework from Supabase
import { createClient } from '@supabase/supabase-js';

export type Pillar = {
  code: string;
  label: string;
  description?: string | null;
  sort?: number | null;
};

export type Theme = {
  code: string;
  label: string;
  pillar_code: string; // FK -> pillars.code
  description?: string | null;
  sort?: number | null;
};

export type Subtheme = {
  code: string;
  label: string;
  theme_code: string; // FK -> themes.code
  description?: string | null;
  sort?: number | null;
};

export type FrameworkList = {
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

// Create a vanilla Supabase client (works fine in a server component)
// Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set.
function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon);
}

/**
 * Fetches all pillars, themes, and subthemes needed for the Primary Framework editor.
 * Assumes RLS allows read for anon OR you are using a service role in your environment (not required).
 */
export async function getFrameworkList(): Promise<FrameworkList> {
  const sb = supabase();

  // Pull pillars
  const { data: pillars, error: pErr } = await sb
    .from('pillars')
    .select('code,label,description,sort')
    .order('sort', { nullsFirst: false, ascending: true });

  if (pErr) throw new Error(`Supabase pillars error: ${pErr.message}`);

  // Pull themes
  const { data: themes, error: tErr } = await sb
    .from('themes')
    .select('code,label,description,sort,pillar_code')
    .order('pillar_code', { ascending: true })
    .order('sort', { nullsFirst: false, ascending: true });

  if (tErr) throw new Error(`Supabase themes error: ${tErr.message}`);

  // Pull subthemes
  const { data: subthemes, error: sErr } = await sb
    .from('subthemes')
    .select('code,label,description,sort,theme_code')
    .order('theme_code', { ascending: true })
    .order('sort', { nullsFirst: false, ascending: true });

  if (sErr) throw new Error(`Supabase subthemes error: ${sErr.message}`);

  return {
    counts: {
      pillars: pillars?.length ?? 0,
      themes: themes?.length ?? 0,
      subthemes: subthemes?.length ?? 0,
    },
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
