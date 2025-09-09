// lib/framework.ts
import { supabase } from '@/lib/supabase'

export async function fetchFrameworkList() {
  // expect pillars, themes, subthemes tables/views you already have
  const [pillars, themes, subthemes] = await Promise.all([
    supabase.from('pillars').select('*').order('order'),
    supabase.from('themes').select('*').order('order'),
    supabase.from('subthemes').select('*').order('order'),
  ])

  if (pillars.error || themes.error || subthemes.error) {
    throw new Error('Failed to load framework data')
  }

  return {
    pillars: pillars.data ?? [],
    themes: themes.data ?? [],
    subthemes: subthemes.data ?? [],
  }
}
