"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-client";
import { Database } from "../../lib/database.types";

// =======================
// Type Composition
// =======================
type CriteriaLevel = Database["public"]["Tables"]["criteria_levels"]["Row"];
type Indicator = Database["public"]["Tables"]["indicators"]["Row"] & {
  criteria_levels: CriteriaLevel[];
};
type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"] & {
  indicators: Indicator[];
};
type Theme = Database["public"]["Tables"]["themes"]["Row"] & {
  subthemes: Subtheme[];
};
type Pillar = Database["public"]["Tables"]["pillars"]["Row"] & {
  themes: Theme[];
};

// =======================
// Component
// =======================
export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFramework() {
      setLoading(true);

      // 1. Fetch pillars
      const { data: pillarsData, error: pillarsError } = await supabase
        .from("pillars")
        .select("*")
        .order("sort_order", { ascending: true });

      if (pillarsError) {
        console.error("Error fetching pillars:", pillarsError.message);
        setLoading(false);
        return;
      }

      if (!pillarsData) {
        setPillars([]);
        setLoading(false);
        return;
      }

      // 2. Fetch themes
      const { data: themesData, error: themesError } = await supabase
        .from("themes")
        .select("*")
        .order("sort_order", { ascending: true });

      if (themesError) {
        console.error("Error fetching themes:", themesError.message);
        setLoading(false);
        return;
      }

      // 3. Fetch subthemes
      const { data: subthemesData, error: subthemesError } = await supabase
        .from("subthemes")
        .select("*")
        .order("sort_order", { ascending: true });

      if (subthemesError) {
        console.error("Error fetching subthemes:", subthemesError.message);
        setLoading(false);
        return;
      }

      // 4. Fetch indicators
      const { data: indicatorsData, error: indicatorsError } = await supabase
        .from("indicators")
        .select("*")
        .order("sort_order", { ascending: true });

      if (indicatorsError) {
        console.error("Error fetching indicators:", indicatorsError.message);
        setLoading(false);
        return;
      }

      // 5. Fetch criteria_levels
      const { data: criteriaData, error: criteriaError } = await supabase
        .from("criteria_levels")
        .select("*")
        .order("sort_order", { ascending: true });

      if (criteriaError) {
        console.error("Error fetching criteria_levels:", criteriaError.message);
        setLoading(false);
        return;
      }

      // ===========================
      // Build nested structure
      // ===========================
      const structuredPillars: Pillar[] = pillarsData.map((pillar) => {
        const pillarThemes = themesData
          ?.filter((t) => t.pillar_id === pillar.id)
          .map((theme) => {
            const themeSubthemes = subthemesData
              ?.filter((st) => st.theme_id === theme.id)
              .map((subtheme) => {
                const subthemeIndicators = indicatorsData
                  ?.filter((i) => i.subtheme_id === subtheme.id)
                  .map((indicator) => {
                    const indicatorCriteria =
                      criteriaData?.filter(
                        (c) => c.indicator_id === indicator.id
                      ) || [];
                    return { ...indicator, criteria_levels: indicatorCriteria };
                  }) || [];

                return { ...subtheme, indicators: subthemeIndicators };
              }) || [];

            return { ...theme, subthemes: themeSubthemes };
          }) || [];

        return { ...pillar, themes: pillarThemes };
      });

      setPillars(structuredPillars);
      setLoading(false);
    }

    fetchFramework();
  }, []);

  // =======================
  // Render
  // =======================
  if (loading) return <p>Loading framework...</p>;

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="rounded border p-4 shadow">
          <h2 className="text-lg font-bold">{pillar.name}</h2>
          <p className="text-sm text-gray-600">{pillar.description}</p>

          <div className="ml-4 mt-2 space-y-4">
            {pillar.themes.map((theme) => (
              <div key={theme.id} className="border-l-2 pl-4">
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>

                <div className="ml-4 mt-2 space-y-2">
                  {theme.subthemes.map((subtheme) => (
                    <div key={subtheme.id} className="border-l-2 pl-4">
                      <h4 className="text-sm font-medium">{subtheme.name}</h4>

                      <div className="ml-4 mt-2 space-y-1">
                        {subtheme.indicators.map((indicator) => (
                          <div
                            key={indicator.id}
                            className="rounded border p-2"
                          >
                            <p className="text-sm font-semibold">
                              {indicator.name}
                            </p>
                            <ul className="ml-4 list-disc text-xs text-gray-600">
                              {indicator.criteria_levels.map((criteria) => (
                                <li key={criteria.id}>
                                  {criteria.label} (score:{" "}
                                  {criteria.default_score})
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
        </div>
      ))}
    </div>
  );
}
