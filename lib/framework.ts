// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import { Database } from "@/types/supabase";

type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
type Theme = Database["public"]["Tables"]["themes"]["Row"];
type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];
type Indicator = Database["public"]["Tables"]["indicators"]["Row"];

export async function fetchFramework(): Promise<
  (Pillar & {
    themes: (Theme & {
      subthemes: (Subtheme & {
        indicators: Indicator[];
      })[];
    })[];
  })[]
> {
  const supabase = createClient();

  // Fetch pillars
  const { data: pillars } = await supabase.from("pillars").select("*").order("sort_order");
  if (!pillars) return [];

  // Fetch themes
  const { data: themes } = await supabase.from("themes").select("*").order("sort_order");
  const { data: subthemes } = await supabase.from("subthemes").select("*").order("sort_order");
  const { data: indicators } = await supabase.from("indicators").select("*").order("sort_order");

  return pillars.map((pillar) => ({
    ...pillar,
    themes: (themes || [])
      .filter((t) => t.pillar_id === pillar.id)
      .map((theme) => ({
        ...theme,
        subthemes: (subthemes || [])
          .filter((st) => st.theme_id === theme.id)
          .map((subtheme) => ({
            ...subtheme,
            indicators: (indicators || []).filter((ind) => ind.subtheme_id === subtheme.id),
          })),
      })),
  }));
}
