// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar } from "@/lib/framework-client";
import { recalcRefCodes, cloneFramework } from "@/lib/framework-utils";

// ---------- Save ----------
export async function saveFramework(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Clear old framework
  await supabase.from("subthemes").delete().neq("id", "");
  await supabase.from("themes").delete().neq("id", "");
  await supabase.from("pillars").delete().neq("id", "");

  // Recalc ref codes fresh
  const recalced = recalcRefCodes(cloneFramework(pillars));

  // Insert back
  for (const pillar of recalced) {
    await supabase.from("pillars").insert({
      id: pillar.id,
      name: pillar.name,
      description: pillar.description,
      sort_order: pillar.sort_order,
      ref_code: pillar.ref_code,
    });

    for (const theme of pillar.themes) {
      await supabase.from("themes").insert({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        sort_order: theme.sort_order,
        ref_code: theme.ref_code,
        pillar_id: pillar.id,
      });

      for (const sub of theme.subthemes) {
        await supabase.from("subthemes").insert({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          sort_order: sub.sort_order,
          ref_code: sub.ref_code,
          theme_id: theme.id,
        });
      }
    }
  }

  return recalced;
}
