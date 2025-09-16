"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";

interface CriteriaLevel {
  id: number;
  label: string;
  default_score: number;
  sort_order: number;
}

interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  criteria_levels: CriteriaLevel[];
}

interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators: Indicator[];
}

interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFramework() {
      setLoading(true);

      const { data, error } = await supabase
        .from("pillars")
        .select(`
          id,
          ref_code,
          name,
          description,
          sort_order,
          themes (
            id,
            ref_code,
            name,
            description,
            sort_order,
            subthemes (
              id,
              ref_code,
              name,
              description,
              sort_order,
              indicators (
                id,
                ref_code,
                name,
                description,
                sort_order,
                criteria_levels (
                  id,
                  label,
                  default_score,
                  sort_order
                )
              )
            )
          )
        `)
        .order("sort_order");

      if (error) {
        console.error("Error loading framework:", error);
        setPillars([]); // ✅ explicitly empty on error
      } else {
        setPillars(data ?? []); // ✅ ensures only Pillar[] or []
      }

      setLoading(false);
    }

    fetchFramework();
  }, []);

  if (loading) {
    return <div>Loading framework...</div>;
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="rounded-lg border p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="text-lg font-medium">{theme.name}</h3>
              <p className="text-gray-500">{theme.description}</p>

              {theme.subthemes?.map((subtheme) => (
                <div key={subtheme.id} className="ml-6 mt-2">
                  <h4 className="font-semibold">{subtheme.name}</h4>
                  <p className="text-gray-500">{subtheme.description}</p>

                  {subtheme.indicators?.map((indicator) => (
                    <div key={indicator.id} className="ml-6 mt-2">
                      <p className="font-medium">{indicator.name}</p>
                      <p className="text-gray-500 text-sm">{indicator.description}</p>

                      <ul className="ml-4 list-disc text-sm text-gray-600">
                        {indicator.criteria_levels?.map((level) => (
                          <li key={level.id}>
                            {level.label} (Score: {level.default_score})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
