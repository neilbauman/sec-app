// /lib/framework.ts
import { createClient } from '@/lib/supabase'
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework'

/**
 * Fetches pillars, themes, subthemes for the Primary Framework Editor.
 * Read-only; relies on public RLS or anon-accessible rows.
 */
export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient()

  const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
    await Promise.all([
      supabase.from('pillars').select('code,name,description,sort_order').order('sort_order', { ascending: true }),
      supabase.from('themes').select('code,pillar_code,name,description,sort_order').order('sort_order', { ascending: true }),
      supabase.from('subthemes').select('code,theme_code,name,description,sort_order').order('sort_order', { ascending: true }),
    ])

  if (pErr || tErr || sErr) {
    const msg = (pErr ?? tErr ?? sErr)?.message ?? 'Unknown Supabase error'
    throw new Error(`Supabase fetch error: ${msg}`)
  }

  return {
    counts: {
      pillars: pillars?.length ?? 0,
      themes: themes?.length ?? 0,
      subthemes: subthemes?.length ?? 0,
    },
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  }
}
