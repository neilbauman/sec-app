// lib/framework.ts
import { createClient } from "@/lib/supabase";
import type { FrameworkList } from "@/types/framework";

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient();

  const { data: pillars, error: pErr } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes, error: tErr } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_code, pillar_id")
    .order("sort_order", { ascending: true });

  const { data: subthemes, error: sErr } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_code, theme_id")
    .order("sort_order", { ascending: true });

  if (pErr || tErr || sErr) {
    throw new Error(
      `Supabase load failed: ${pErr?.message ?? ""} ${tErr?.message ?? ""} ${sErr?.message ?? ""}`.trim()
    );
  }

  return { pillars: pillars ?? [], themes: themes ?? [], subthemes: subthemes ?? [] };
}
