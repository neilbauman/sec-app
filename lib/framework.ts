// /lib/framework.ts
import { createClient } from '@/lib/supabase';
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework';

/**
 * Fetches the full framework lists (pillars, themes, subthemes)
 * using your existing column names (sort_order).
 */
export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient();

  // Pillars
  const { data: pillarsData, error: pillarsErr } = await supabase
    .from('pillars')
    .select('code,name,description,sort_order')
    .order('sort_order', { ascending: true });

  if (pillarsErr) throw new Error(`pillars error: ${pillarsErr.message}`);

  // Themes
  const { data: themesData, error: themesErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,sort_order')
    .order('pillar_code', { ascending: true })
    .order('sort_order', { ascending: true });

  if (themesErr) throw new Error(`themes error: ${themesErr.message}`);

  // Subthemes
  const { data: subsData, error: subsErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,name,description,sort_order')
    .order('theme_code', { ascending: true })
    .order('sort_order', { ascending: true });

  if (subsErr) throw new Error(`subthemes error: ${subsErr.message}`);

  // Strongly type the outputs
  const pillars = (pillarsData ?? []) as Pillar[];
  const themes = (themesData ?? []) as Theme[];
  const subthemes = (subsData ?? []) as Subtheme[];

  return { pillars, themes, subthemes };
}
