// --- Database Schema Types for Framework ---

export interface CriterionLevel {
  id: number            // PK
  indicator_id: string  // FK → indicators.id
  label: string
  default_score: number
  sort_order: number
}

export interface Indicator {
  id: string            // PK
  subtheme_id: string   // FK → subthemes.id
  theme_id: string      // FK → themes.id
  ref_code: string
  name: string
  description: string
  level: string
  sort_order: number
  criteria_levels?: CriterionLevel[]
}

export interface Subtheme {
  id: string            // PK
  theme_id: string      // FK → themes.id
  ref_code: string
  theme_code: string
  name: string
  description: string | null
  sort_order: number
  indicators?: Indicator[]
}

export interface Theme {
  id: string            // PK
  pillar_id: string     // FK → pillars.id
  ref_code: string
  pillar_code: string
  name: string
  description: string | null
  sort_order: number
  subthemes?: Subtheme[]
}

export interface Pillar {
  id: string            // PK
  ref_code: string
  name: string
  description: string | null
  sort_order: number
  themes?: Theme[]
}
