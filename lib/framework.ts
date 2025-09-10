// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";

// Re-export shared types so callers can import them from here too.
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Fetch the full framework as three lists.
 * Server-only: called from RSC/route handlers (no client bundling).
 */
export async function fetchFrameworkList(): Promise<{
  pillars: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    sort_order: number;
  }>;
  themes: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    sort_order: number;
    pillar_id: string | null;
    pillar_code?: string | null;
  }>;
  subthemes: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    sort_order: number;
    theme_id: string | null;
    theme_code?: string | null;
  }>;
}> {
  const supabase = createServerSupabase();

  // Pillars
  const { data: pillarsRaw, error: pillarsErr } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarsErr) throw pillarsErr;

  // Themes (include pillar_code for easy grouping in the UI if it exists)
  const { data: themesRaw, error: themesErr } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id, pillar_code")
    .order("sort_order", { ascending: true });

  if (themesErr) throw themesErr;

  // Subthemes (include theme_code for easy grouping in the UI if it exists)
  const { data: subthemesRaw, error: subthemesErr } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_id, theme_code")
    .order("sort_order", { ascending: true });

  if (subthemesErr) throw subthemesErr;

  // Defensive normalization to keep the UI happy even if nulls sneak in.
  const pillars = (pillarsRaw ?? []).map((p) => ({
    id: String((p as any)?.id ?? ""),
    code: String((p as any)?.code ?? ""),
    name: String((p as any)?.name ?? ""),
    description: (p as any)?.description ?? null,
    sort_order: Number((p as any)?.sort_order ?? 0),
  }));

  const themes = (themesRaw ?? []).map((t) => ({
    id: String((t as any)?.id ?? ""),
    code: String((t as any)?.code ?? ""),
    name: String((t as any)?.name ?? ""),
    description: (t as any)?.description ?? null,
    sort_order: Number((t as any)?.sort_order ?? 0),
    pillar_id: (t as any)?.pillar_id ?? null,
    pillar_code: (t as any)?.pillar_code ?? null,
  }));

  const subthemes = (subthemesRaw ?? []).map((s) => ({
    id: String((s as any)?.id ?? ""),
    code: String((s as any)?.code ?? ""),
    name: String((s as any)?.name ?? ""),
    description: (s as any)?.description ?? null,
    sort_order: Number((s as any)?.sort_order ?? 0),
    theme_id: (s as any)?.theme_id ?? null,
    theme_code: (s as any)?.theme_code ?? null,
  }));

  return { pillars, themes, subthemes };
}
