import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

export default async function FrameworkPage() {
  const supabase = await createServerSupabaseClient();

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(
      `
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
            sort_order
          )
        )
      `
    )
    .order("sort_order");

  if (error) {
    console.error(error);
    return <p>Error loading framework.</p>;
  }

  return <PrimaryFrameworkCards pillars={(pillars as Pillar[]) ?? []} />;
}
