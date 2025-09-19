import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type alias for convenience
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"] & {
  themes: (Database["public"]["Tables"]["themes"]["Row"] & {
    subthemes: (Database["public"]["Tables"]["subthemes"]["Row"] & {
      indicators: Database["public"]["Tables"]["indicators"]["Row"][];
    })[];
  })[];
};

export async function fetchFramework(): Promise<Pillar[]> {
  // Get latest framework version
  const { data: version, error: versionError } = await supabase
    .from("primary_framework_versions")
    .select("id")
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (versionError || !version) {
    throw new Error(versionError?.message || "No framework version found");
  }

  // Fetch pillars with nested themes → subthemes → indicators
  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes (
        id,
        ref_code,
        name,
        description,
        sort_order,
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          indicators (
            id,
            ref_code,
            name,
            description,
            level,
            sort_order
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Pillar[];
}
