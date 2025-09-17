// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";

export async function getFramework() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      sort_order,
      themes (
        id,
        name,
        description,
        sort_order,
        subthemes (
          id,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error loading framework:", error);
    return [];
  }

  return data || [];
}
