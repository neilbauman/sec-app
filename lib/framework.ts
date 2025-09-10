// lib/framework.ts
import { createClientOnServer } from "@/lib/supabase";

export async function fetchFrameworkList() {
  const supabase = await createClientOnServer();

  // ...rest unchanged...
  const { data: pillars } = await supabase.from("pillars").select("id, code, name, description, sort_order").order("sort_order", { ascending: true });
  const { data: themes } = await supabase.from("themes").select("id, code, name, description, sort_order, pillar_id").order("sort_order", { ascending: true });
  const { data: subthemes } = await supabase.from("subthemes").select("id, code, name, description, sort_order, theme_id").order("sort_order", { ascending: true });

  return { pillars: pillars ?? [], themes: themes ?? [], subthemes: subthemes ?? [] };
}
