// Utilities for reading framework records from Supabase
import { createClient } from "@/lib/supabase";
import type { FrameworkList, Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient();

  const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
    await Promise.all([
      supabase
        .from("pillars")
        .select("code, name, description, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("themes")
        .select("code, pillar_code, name, description, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("subthemes")
        .select("code, theme_code, name, description, sort_order")
        .order("sort_order", { ascending: true }),
    ]);

  const err = pErr || tErr || sErr;
  if (err) {
    throw new Error(err.message);
  }

  const result: FrameworkList = {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
    counts: {
      pillars: pillars?.length ?? 0,
      themes: themes?.length ?? 0,
      subthemes: subthemes?.length ?? 0,
    },
  };

  return result;
}
