import { createClient } from '@/lib/supabase-browser';

export async function getPillars() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getThemes(pillarId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('pillar_id', pillarId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSubthemes(themeId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subthemes')
    .select('*')
    .eq('theme_id', themeId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}
