// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
export type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  try {
    const supabase = createServerSupabase();

    const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
      await Promise.all([
        supabase.from("pillars").select("*").order("sort_order", { ascending: true }),
        supabase.from("themes").select("*").order("sort_order", { ascending: true }),
        supabase.from("subthemes").select("*").order("sort_order", { ascending: true }),
      ]);

    if (pErr || tErr || sErr) {
      const e = pErr ?? tErr ?? sErr;
      throw new Error(e?.message || "Unknown Supabase error");
    }

    return {
      pillars: (pillars ?? []) as any,
      themes: (themes ?? []) as any,
      subthemes: (subthemes ?? []) as any,
    };
  } catch (err) {
    // Never crash the server render; return stable empties.
    console.error("[fetchFrameworkList] failed:", err);
    return { pillars: [], themes: [], subthemes: [] };
  }
}
