// /lib/framework.ts
import { supabase } from "./supabase-client";
import type { Pillar, Theme, Subtheme, Indicator, CriteriaLevel } from "@/types/framework";

export async function fetchFramework(): Promise<Pillar[]> {
  // Step 1: fetch each table ordered by sort_order
  const { data: pillarsData, error: pillarsError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (pillarsError) throw pillarsError;

  const { data: themesData, error: themesError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (themesError) throw themesError;

  const { data: subthemesData, error: subthemesError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subthemesError) throw subthemesError;

  const { data: indicatorsData, error: indicatorsError } = await supabase
    .from("indicators")
    .select("*")
    .order("sort_order", { ascending: true });

  if (indicatorsError) throw indicatorsError;

  const { data: criteriaLevelsData, error: criteriaError } = await supabase
    .from("criteria_levels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (criteriaError) throw criteriaError;

  // Step 2: join manually (locking IDs from schema)
  return (pillarsData || []).map((pillar) => {
    const pillarThemes: Theme[] = (themesData || [])
      .filter((t) => t.pillar_id === pillar.id)
      .map((theme) => {
        const themeSubthemes: Subtheme[] = (subthemesData || [])
          .filter((s) => s.theme_id === theme.id)
          .map((sub) => {
            const subIndicators: Indicator[] = (indicatorsData || [])
              .filter((i) => i.subtheme_id === sub.id)
              .map((indicator) => {
                const indicatorCriteria: CriteriaLevel[] =
                  (criteriaLevelsData || []).filter(
                    (c) => c.indicator_id === indicator.id
                  );
                return { ...indicator, criteria_levels: indicatorCriteria };
              });

            return { ...sub, indicators: subIndicators };
          });

        return { ...theme, subthemes: themeSubthemes };
      });

    return { ...pillar, themes: pillarThemes };
  });
}
