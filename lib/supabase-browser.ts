import { supabaseBrowser } from '@/lib/supabase-browser';

export async function getPillars() {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}
