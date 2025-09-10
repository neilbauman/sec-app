// lib/framework.ts
import { cookies } from "next/headers";
import { createClientOnServer } from "@/lib/supabase";

export type Pillar = { id: string; code: string; name: string; description: string | null; sort_order: number };
export type Theme = { id: string; code: string; name: string; description: string | null; sort_order: number; pillar_id: string | null; pillar_code?: string | null };
export type Subtheme = { id: string; code: string; name: string; description: string | null; sort_order: number; theme_id: string | null; theme_code?: string | null };

export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  const cookieStore = await cookies();
  const supabase = createClientOnServer({
    get: (n) => cookieStore.get(n)?.value,
    set: () => {},
    remove: () => {}
  });

  const [pillarsRes, themesRes, subthemesRes] = await Promise.all([
    supabase.from("pillars").select("id, code, name, description, sort_order").order("sort_order", { ascending: true }),
    supabase.from("themes").select("id, code, name, description, sort_order, pillar_id, pillar_code").order("sort_order", { ascending: true }),
    supabase.from("subthemes").select("id, code, name, description, sort_order, theme_id, theme_code").order("sort_order", { ascending: true })
  ]);

  if (pillarsRes.error) throw pillarsRes.error;
  if (themesRes.error) throw themesRes.error;
  if (subthemesRes.error) throw subthemesRes.error;

  return {
    pillars: pillarsRes.data ?? [],
    themes: themesRes.data ?? [],
    subthemes: subthemesRes.data ?? []
  };
}
