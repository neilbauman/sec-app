// app/framework/page.tsx
import { unstable_noStore as noStore } from 'next/cache'
import { getServerClient } from '@/lib/supabaseServer'
import FrameworkTree from './FrameworkTree'

// Simple shared shapes (kept inline to avoid imports that could confuse the build)
type Pillar = {
  code: string
  name: string | null
  description: string | null
  sort_order: number | null
}
type Theme = {
  code: string
  pillar_code: string | null
  name: string | null
  description: string | null
  sort_order: number | null
}
type Subtheme = {
  code: string
  theme_code: string | null
  name: string | null
  description: string | null
  sort_order: number | null
}

export default async function FrameworkPage() {
  // Force dynamic rendering to avoid any prerender/static export attempts
  noStore()

  const supabase = getServerClient()

  // Pull everything needed for the hierarchy, ordered for stable display
  const [{ data: pillars = [] }, { data: themes = [] }, { data: subthemes = [] }] =
    await Promise.all([
      supabase
        .from('pillars')
        .select('code,name,description,sort_order')
        .order('sort_order', { ascending: true })
        .order('code', { ascending: true }),

      supabase
        .from('themes')
        .select('code,pillar_code,name,description,sort_order')
        .order('sort_order', { ascending: true })
        .order('code', { ascending: true }),

      supabase
        .from('subthemes')
        .select('code,theme_code,name,description,sort_order')
        .order('sort_order', { ascending: true })
        .order('code', { ascending: true }),
    ])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">Primary Framework Editor</h1>

      <p className="mt-2 text-sm text-gray-500">
        Read-only view for now. Expand/collapse to browse pillars, themes, and sub-themes.
      </p>

      <div className="mt-6">
        <FrameworkTree
          pillars={pillars as Pillar[]}
          themes={themes as Theme[]}
          subthemes={subthemes as Subtheme[]}
        />
      </div>
    </div>
  )
}
