import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Framework Overview</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {pillars?.map((pillar) => (
          <div key={pillar.id} className="rounded-lg border p-4 shadow">
            <h2 className="text-lg font-semibold">
              {pillar.ref_code} – {pillar.name}
            </h2>
            {pillar.description && (
              <p className="text-sm text-gray-600">{pillar.description}</p>
            )}
            {pillar.themes.length > 0 && (
              <ul className="mt-2 list-disc pl-6 text-sm">
                {pillar.themes.map((theme) => (
                  <li key={theme.id}>
                    {theme.ref_code} – {theme.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
