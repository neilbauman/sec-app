'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import type { Pillar } from '@/types/framework'

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFramework = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('pillars')
        .select(`
          id,
          ref_code,
          name,
          description,
          sort_order,
          themes:themes (
            id,
            ref_code,
            pillar_code,
            name,
            description,
            sort_order,
            subthemes:subthemes (
              id,
              ref_code,
              theme_code,
              name,
              description,
              sort_order,
              indicators:indicators (
                id,
                ref_code,
                subtheme_id,
                theme_id,
                name,
                description,
                level,
                sort_order,
                criteria_levels:criteria_levels (
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
        console.error('Error fetching framework:', error)
      } else {
        setPillars((data as Pillar[]) || [])
      }

      setLoading(false)
    }

    fetchFramework()
  }, [])

  if (loading) {
    return <p className="text-gray-500">Loading framework...</p>
  }

  if (!pillars.length) {
    return (
      <div className="p-4 bg-gray-50 border rounded-md">
        No framework data found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="p-4 border rounded-md shadow-sm bg-white">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          <div className="mt-4 space-y-4">
            {pillar.themes?.map((theme) => (
              <div key={theme.id} className="ml-4">
                <h3 className="text-lg font-medium">{theme.name}</h3>
                <p className="text-gray-600">{theme.description}</p>

                <div className="mt-2 space-y-3">
                  {theme.subthemes?.map((subtheme) => (
                    <div key={subtheme.id} className="ml-6">
                      <h4 className="text-md font-semibold">{subtheme.name}</h4>
                      <p className="text-gray-600">{subtheme.description}</p>

                      <ul className="mt-2 list-disc list-inside">
                        {subtheme.indicators?.map((indicator) => (
                          <li key={indicator.id} className="ml-4">
                            <strong>{indicator.name}</strong> – {indicator.description}
                            {indicator.criteria_levels && (
                              <ul className="ml-6 list-decimal">
                                {indicator.criteria_levels.map((criterion) => (
                                  <li key={criterion.id}>
                                    {criterion.label} (Default Score: {criterion.default_score})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
