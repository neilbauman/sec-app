// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/refCodes";

// ---------- Update ----------
export async function updateRow(
  pillars: NestedPillar[],
  type: "pillar" | "theme" | "subtheme",
  id: string,
  updates: Partial<{ name: string; description: string }>
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Update DB
  if (type === "pillar") {
    const { error } = await supabase
      .from("pillars")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  if (type === "theme") {
    const { error } = await supabase
      .from("themes")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  if (type === "subtheme") {
    const { error } = await supabase
      .from("subthemes")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  }

  // Update local state
  const newPillars = pillars.map((pillar) => {
    if (type === "pillar" && pillar.id === id) {
      return { ...pillar, ...updates };
    }
    const updatedThemes = pillar.themes.map((theme) => {
      if (type === "theme" && theme.id === id) {
        return { ...theme, ...updates };
      }
      const updatedSubs = theme.subthemes.map((sub) =>
        type === "subtheme" && sub.id === id ? { ...sub, ...updates } : sub
      );
      return { ...theme, subthemes: updatedSubs };
    });
    return { ...pillar, themes: updatedThemes };
  });

  return recalcRefCodes(newPillars);
}
