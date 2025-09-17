"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

// Types matching your schema
interface CriteriaLevel {
  id: number;
  label: string;
  default_score: number;
  sort_order: number;
}

interface Indicator {
  id: string;
  ref_code: string;
  level: string;
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
    const fetchFramework = async () => {
      setLoading(true);

      const { data: pillarsData, error } = await supabase
        .from("pillars")
        .select(
          `
          id, ref_code, name, description, sort_order,
          themes:themes (
            id, ref_code, name, description, sort_order,
            subthemes:subthemes (
              id, ref_code, name, description, sort_order,
              indicators:indicators (
                id, ref_code, level, name, description, sort_order,
                criteria_levels:criteria_levels (
                  id, label, default_score, sort_order
                )
              )
            )
          )
        `
        )
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching framework:", error.message);
      } else {
        setPillars(pillarsData || []);
      }

      setLoading(false);
    };

    fetchFramework();
  }, []);

  if (loading) {
    return <div>Loading framework...</div>;
  }

  if (!pillars.length) {
    return <div>No framework data found.</div>;
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-lg border p-4 shadow-sm bg-white"
        >
          <h2 className="text-xl font-bold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {pillar.themes.map((theme) => (
            <div key={theme.id} className="ml-4 mt-4">
              <h3 className="text-lg font-semibold">{theme.name}</h3>
              <p className="text-gray-500">{theme.description}</p>

              {theme.subthemes.map((subtheme) => (
                <div key={subtheme.id} className="ml-6 mt-2">
                  <h4 className="font-medium">{subtheme.name}</h4>
                  <p className="text-gray-400">{subtheme.description}</p>

                  {subtheme.indicators.map((indicator) => (
                    <div key={indicator.id} className="ml-6 mt-2">
                      <p className="font-semibold">{indicator.name}</p>
                      <p className="text-gray-400">{indicator.description}</p>

                      {indicator.criteria_levels.map((level) => (
                        <div key={level.id} className="ml-6 mt-1 text-sm">
                          <span className="font-medium">{level.label}</span>{" "}
                          (Default Score: {level.default_score})
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
  );
}
