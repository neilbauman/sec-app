import { createClient } from "@/lib/supabase-server";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import type { Pillar } from "@/types/framework";

export default async function PrimaryFrameworkEditorPage() {
  const supabase = createClient();

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(
      `
        id,
        name,
        description,
        ref_code,
        sort_order,
        themes (
          id,
          pillar_id,
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
            theme_id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching pillars:", error);
    return <div>Error loading framework</div>;
  }

  return <PrimaryFrameworkEditorClient initialPillars={pillars ?? []} />;
}
