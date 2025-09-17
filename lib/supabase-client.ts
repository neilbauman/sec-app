import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types for framework schema
export interface CriterionLevel {
  id: number
  indicator_id: string
  label: string
  default_score: number
  sort_order: number
}

export interface Indicator {
  id: string
  subtheme_id: string
  theme_id: string
  ref_code: string
  name: string
  description: string
  level: string
  sort_order: number
  criteria_levels?: CriterionLevel[]
}

export interface Subtheme {
  id: string
  theme_id: string
  ref_code: string
  theme_code: string
  name: string
  description: string | null
  sort_order: number
  indicators?: Indicator[]
}

export interface Theme {
  id: string
  pillar_id: string
  ref_code: string
  pillar_code: string
  name: string
  description: string | null
  sort_order: number
  subthemes?: Subtheme[]
}

export interface Pillar {
  id: string
  ref_code: string
  name: string
  description: string | null
  sort_order: number
  themes?: Theme[]
}
