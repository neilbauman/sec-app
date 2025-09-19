import { createClient } from '@/lib/supabaseClient';

const supabase = createClient();

export async function getPillars() {
  const { data, error } = await supabase
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

// Similar functions for themes and subthemes can be added here.
