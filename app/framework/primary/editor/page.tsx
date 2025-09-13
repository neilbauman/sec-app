// app/framework/primary/editor/page.tsx
import { createClient } from "@/utils/supabase/server";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar } from "@/types/framework";

export default async function Page() {
  const supabase = createClient();

  // ✅ Explicitly tell Supabase to use themes.pillar_id_fkey → pillars.id
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      code,
      name,
      description,
      sort_order,
      themes:themes!themes_pillar_id_fkey (
        id,
        code,
        name,
        description,
        sort_order,
        subthemes (
          id,
          code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Failed to load pillars:", error.message);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="mt-4 text-red-600">
          ❌ Failed to load pillars: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={(pillars as Pillar[]) ?? []} />
    </div>
  );
}
