// lib/framework.ts
import { supabaseServer } from './supabase'

// Shared types used by the editor UI
export type Pillar = {
  code: string
  name: string
  description: string | null
  sort_order: number | null
}

export type Theme = {
  code: string
  pillar_code: string
  name: string
  description: string | null
  sort_order: number | null
}

export type Subtheme = {
  code: string
  theme_code: string
  name: string
  description: string | null
  sort_order: number | null
}

export type FrameworkList = {
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = supabaseServer()

  // 1) pillars
  const { data: pillars, error: pillarsErr } = await supabase
    .from('pillars')
    .select('code, name, description, sort_order')
    .order('sort_order', { ascending: true, nullsFirst: true })
    .order('code', { ascending: true })

  if (pillarsErr) {
    throw new Error(
      `Supabase pillars error: ${pillarsErr.message} — check env vars, table names, and RLS policies.`
    )
  }

  // 2) themes
  const { data: themes, error: themesErr } = await supabase
    .from('themes')
    .select('code, pillar_code, name, description, sort_order')
    .order('sort_order', { ascending: true, nullsFirst: true })
    .order('code', { ascending: true })

  if (themesErr) {
    throw new Error(
      `Supabase themes error: ${themesErr.message} — check table names and RLS policies.`
    )
  }

  // 3) subthemes
  const { data: subthemes, error: subthemesErr } = await supabase
    .from('subthemes')
    .select('code, theme_code, name, description, sort_order')
    .order('sort_order', { ascending: true, nullsFirst: true })
    .order('code', { ascending: true })

  if (subthemesErr) {
    throw new Error(
      `Supabase subthemes error: ${subthemesErr.message} — check table names and RLS policies.`
    )
  }

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  }
}
