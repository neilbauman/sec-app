// Fetch pillars → themes → subthemes (read-only tree)
import { getServerSupabase } from "@/lib/supabase-server";

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export type ThemeNode = Theme & { subthemes: Subtheme[] };
export type PillarNode = Pillar & { themes: ThemeNode[] };

export async function getPrimaryFramework(): Promise<PillarNode[]> {
  const supabase = await getServerSupabase();

  const { data: pillars, error: pErr } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pErr) throw new Error(pErr.message);
  if (!pillars?.length) return [];

  const { data: themes, error: tErr } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (tErr) throw new Error(tErr.message);

  const { data: subthemes, error: sErr } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (sErr) throw new Error(sErr.message);

  // Build lookups
  const themeNodesById = new Map<string, ThemeNode>();
  const themesByPillar = new Map<string, ThemeNode[]>();
  pillars.forEach(p => themesByPillar.set(p.id, []));

  (themes ?? []).forEach(t => {
    const node: ThemeNode = { ...t, subthemes: [] };
    themeNodesById.set(t.id, node);
    const bucket = themesByPillar.get(t.pillar_id);
    if (bucket) bucket.push(node);
  });

  (subthemes ?? []).forEach(st => {
    const parent = themeNodesById.get(st.theme_id);
    if (parent) parent.subthemes.push(st);
  });

  return pillars.map(p => ({
    ...p,
    themes: themesByPillar.get(p.id) ?? [],
  }));
}
