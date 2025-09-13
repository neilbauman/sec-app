import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

export default async function FrameworkPage() {
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
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
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
    console.error("Error fetching framework:", error);
    return <p>Error loading framework</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Framework</h1>
      <PrimaryFrameworkCards pillars={pillars as Pillar[]} />
    </div>
  );
}
