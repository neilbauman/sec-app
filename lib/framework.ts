// /lib/framework.ts
import { createClient } from '@/lib/supabase'
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework'

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient()

  const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
    await Promise.all([
      supabase.from('pillars').select('*').order('sort_order', { ascending: true }) as any,
      supabase.from('themes').select('*').order('sort_order', { ascending: true }) as any,
      supabase.from('subthemes').select('*').order('sort_order', { ascending: true }) as any,
    ])

  if (pErr || tErr || sErr) {
    const msg = [pErr?.message, tErr?.message, sErr?.message].filter(Boolean).join(' | ')
    throw new Error(`Supabase fetch error: ${msg || 'unknown'}`)
  }

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  }
}
