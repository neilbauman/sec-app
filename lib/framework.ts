// /lib/framework.ts
import { supabase } from "./supabase-client";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFramework(): Promise<Pillar[]> {
  // Fetch pillars, themes, subthemes separately
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

  // Join manually (schema locked to UUID keys)
  return (pillarsData || []).map((pillar) => {
    const pillarThemes: Theme[] = (themesData || [])
      .filter((t) => t.pillar_id === pillar.id)
      .map((theme) => {
        const themeSubthemes: Subtheme[] = (subthemesData || []).filter(
          (s) => s.theme_id === theme.id
        );
        return { ...theme, subthemes: themeSubthemes };
      });

    return { ...pillar, themes: pillarThemes };
  });
}
