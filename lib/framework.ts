// lib/framework.ts
import { createClientOnServer } from "@/lib/supabase";

export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string | null;
  pillar_code?: string | null;
};

export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string | null;
  theme_code?: string | null;
};

// Server-side fetch of the framework lists
export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  // NOTE: our helper takes no parameters
  const supabase = await createClientOnServer();

  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select(
      "id, code, name, description, sort_order, pillar_id, pillar_code"
    )
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select(
      "id, code, name, description, sort_order, theme_id, theme_code"
    )
    .order("sort_order", { ascending: true });

  return {
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
