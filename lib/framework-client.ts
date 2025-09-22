// lib/framework-client.ts

// ---------- DB Types (match Supabase schema) ----------
export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string; // ✅ FK to Pillar
  name: string;
  description: string | null;
  sort_order: number;
};

export type Subtheme = {
  id: string;
  theme_id: string; // ✅ FK to Theme
  name: string;
  description: string | null;
  sort_order: number;
};

// ---------- Nested Types (used in UI) ----------
export type NestedPillar = Pillar & {
  ref_code: string;       // Derived, not stored in DB
  themes: NestedTheme[];
};

export type NestedTheme = Theme & {
  ref_code: string;       // Derived, not stored in DB
  subthemes: NestedSubtheme[];
};

export type NestedSubtheme = Subtheme & {
  ref_code: string;       // Derived, not stored in DB
};

// ---------- Client Helpers ----------
// (You’ll typically have fetchFramework implemented here, or imported)

import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/refCodes";

/**
 * Fetch pillars → themes → subthemes from Supabase
 * and normalize into Nested types with ref_codes.
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const { data: pillars, error: pErr } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (pErr) throw pErr;

  const { data: themes, error: tErr } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (tErr) throw tErr;

  const { data: subs, error: sErr } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (sErr) throw sErr;

  // Build nested structure
  const nested: NestedPillar[] = (pillars || []).map((p) => ({
    ...p,
    ref_code: "",
    themes: (themes || [])
      .filter((t) => t.pillar_id === p.id)
      .map((t) => ({
        ...t,
        ref_code: "",
        subthemes: (subs || [])
          .filter((s) => s.theme_id === t.id)
          .map((s) => ({
            ...s,
            ref_code: "",
          })),
      })),
  }));

  // Derive ref_codes
  return recalcRefCodes(nested);
}
