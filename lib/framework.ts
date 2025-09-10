// lib/framework.ts
import { createClient } from '@/lib/supabase';
import type { FrameworkList } from '@/types/framework';

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient();

  const { data: pillars, error: pErr } = await supabase
    .from('pillars')
    .select('id, code, name, description, sort_order')
    .order('sort_order', { ascending: true });

  if (pErr) throw pErr;

  const { data: themes, error: tErr } = await supabase
    .from('themes')
    .select('id, code, pillar_id, pillar_code, name, description, sort_order')
    .order('sort_order', { ascending: true });

  if (tErr) throw tErr;

  const { data: subthemes, error: sErr } = await supabase
    .from('subthemes')
    .select('id, code, theme_id, theme_code, name, description, sort_order')
    .order('sort_order', { ascending: true });

  if (sErr) throw sErr;

  return {
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
