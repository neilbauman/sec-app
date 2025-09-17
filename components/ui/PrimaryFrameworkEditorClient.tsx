"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/lib/database.types";

type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
type Theme = Database["public"]["Tables"]["themes"]["Row"];
type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];
type Indicator = Database["public"]["Tables"]["indicators"]["Row"];
type CriteriaLevel = Database["public"]["Tables"]["criteria_levels"]["Row"];

// Nested types
type NestedIndicator = Indicator & { criteria_levels: CriteriaLevel[] };
type NestedSubtheme = Subtheme & { indicators: NestedIndicator[] };
type NestedTheme = Theme & { subthemes: NestedSubtheme[] };
type NestedPillar = Pillar & { themes: NestedTheme[] };

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<NestedPillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFramework = async () => {
      setLoading(true);

      const { data: pillarsData, error: pillarsError } = await supabase
        .from("pillars")
        .select(
          `
          id, ref_code, name, description, sort_order,
          themes (
            id, ref_code, pillar_code, name, description, sort_order,
            subthemes (
              id, ref_code, theme_code, name, description, sort_order,
              indicators (
                id, ref_code, level, name, description, sort_order,
                criteria_levels (
                  id, label, default_score, sort_order
                )
              )
            )
          )
        `
        )
        .order("sort_order", { ascending: true });

      if (pillarsError) {
        console.error("Error fetching pillars:", pillarsError);
        setLoading(false);
        return;
      }

      // Cast data into NestedPillar[]
      setPillars((pillarsData as unknown as NestedPillar[]) || []);
      setLoading(false);
    };

    fetchFramework();
  }, []);

  if (loading) {
    return <p>Loading framework…</p>;
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="rounded-lg border bg-white p-6 shadow">
          <h2 className="text-xl font-bold">{pillar.name}</h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          <div className="mt-4 space-y-4">
            {pillar.themes?.map((theme) => (
              <div
                key={theme.id}
                className="border-l-2 border-gray-200 pl-4 space-y-2"
              >
                <h3 className="text-lg font-semibold">{theme.name}</h3>
                {theme.description && (
                  <p className="text-sm text-gray-600">{theme.description}</p>
                )}

                {theme.subthemes?.map((subtheme) => (
                  <div
                    key={subtheme.id}
                    className="border-l-2 border-gray-200 pl-4 space-y-2"
                  >
                    <h4 className="text-md font-medium">{subtheme.name}</h4>
                    {subtheme.description && (
                      <p className="text-sm text-gray-600">
                        {subtheme.description}
                      </p>
                    )}

                    {subtheme.indicators?.map((indicator) => (
                      <div
                        key={indicator.id}
                        className="border-l-2 border-gray-200 pl-4 space-y-1"
                      >
                        <h5 className="text-sm font-semibold">
                          {indicator.name}
                        </h5>
                        {indicator.description && (
                          <p className="text-xs text-gray-600">
                            {indicator.description}
                          </p>
                        )}

                        {indicator.criteria_levels?.map((level) => (
                          <div
                            key={level.id}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <span className="text-xs text-gray-800">
                              {level.label} (default score:{" "}
                              {level.default_score ?? "n/a"})
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
