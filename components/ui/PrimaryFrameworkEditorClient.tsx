'use client'

import { useEffect, useState } from 'react'
import { supabase, Pillar } from '@/lib/supabase-client'

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFramework = async () => {
      const { data, error } = await supabase
        .from('pillars')
        .select(`
          id,
          ref_code,
          name,
          description,
          sort_order,
          themes (
            id,
            pillar_id,
            ref_code,
            pillar_code,
            name,
            description,
            sort_order,
            subthemes (
              id,
              theme_id,
              ref_code,
              theme_code,
              name,
              description,
              sort_order,
              indicators (
                id,
                subtheme_id,
                theme_id,
                ref_code,
                name,
                description,
                level,
                sort_order,
                criteria_levels (
                  id,
                  indicator_id,
                  label,
                  default_score,
                  sort_order
                )
              )
            )
          )
        `)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error loading framework:', error)
        setPillars([])
      } else {
        setPillars(data || [])
      }

      setLoading(false)
    }

    fetchFramework()
  }, [])

  if (loading) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Loading framework...
      </div>
    )
  }

  if (!pillars.length) {
    return (
      <div className="p-4 border rounded-md bg-white shadow-sm">
        No framework data found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="p-4 border rounded-md bg-white shadow">
          <h2 className="text-lg font-semibold">{pillar.name}</h2>
          <p className="text-sm text-gray-600">{pillar.description}</p>

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="font-medium">{theme.name}</h3>
              <p className="text-sm text-gray-500">{theme.description}</p>

              {theme.subthemes?.map((sub) => (
                <div key={sub.id} className="ml-6 mt-2">
                  <h4 className="font-medium">{sub.name}</h4>
                  <p className="text-sm text-gray-500">{sub.description}</p>

                  {sub.indicators?.map((ind) => (
                    <div key={ind.id} className="ml-6 mt-1">
                      <p className="font-medium">{ind.name}</p>
                      <p className="text-sm text-gray-500">{ind.description}</p>

                      {ind.criteria_levels?.map((crit) => (
                        <div key={crit.id} className="ml-6 mt-1 text-sm">
                          {crit.label} (default: {crit.default_score})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
