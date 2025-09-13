// app/framework/primary/editor/page.tsx
import { createClient } from "@/utils/supabase/server";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar } from "@/types/framework";

export default async function Page() {
  const supabase = createClient();

  // ✅ Explicit join paths to disambiguate relationships
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      code,
      sort_order,
      themes:themes!themes_pillar_id_fkey (
        id,
        name,
        description,
        code,
        sort_order,
        subthemes:subthemes!subthemes_theme_id_fkey (
          id,
          name,
          description,
          code,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="p-6 text-red-600">
        ❌ Failed to load pillars: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={(pillars as Pillar[]) ?? []} />
    </div>
  );
}
