// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Fetches the full framework (pillars → themes → subthemes) in a nested hierarchy.
 * Uses explicit relationship disambiguation to avoid Supabase ambiguity errors.
 */
export async function fetchFramework(): Promise<{
  pillars: (import("@/types/framework").Pillar & {
    themes: (import("@/types/framework").Theme & {
      subthemes: import("@/types/framework").Subtheme[];
    })[];
  })[];
  error?: string;
}> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pillars")
    // ✅ Explicit disambiguation for themes relation
    .select("*, themes!themes_pillar_id_fkey(*, subthemes(*))")
    .order("sort_order", { ascending: true });

  return {
    pillars: (data as any) || [],
    error: error?.message,
  };
}
