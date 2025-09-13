// app/framework/primary/editor/page.tsx
import { createClient } from "@supabase/supabase-js";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch pillars + themes
  const { data: pillars, error: pillarsError } = await supabase
    .from("pillars")
    .select(
      `
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
        sort_order
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (pillarsError) {
    return (
      <div className="p-6 text-red-600">
        ❌ Failed to load pillars: {pillarsError.message}
      </div>
    );
  }

  // Fetch subthemes separately
  const { data: subthemes, error: subthemesError } = await supabase
    .from("subthemes")
    .select(`
      id,
      name,
      description,
      code,
      sort_order,
      theme_id
    `);

  if (subthemesError) {
    return (
      <div className="p-6 text-red-600">
        ❌ Failed to load subthemes: {subthemesError.message}
      </div>
    );
  }

  // Merge subthemes into themes manually
  const pillarsWithSubthemes = (pillars as Pillar[]).map((pillar) => ({
    ...pillar,
    themes: pillar.themes.map((theme: Theme) => ({
      ...theme,
      subthemes: subthemes?.filter((st) => st.theme_id === theme.id) ?? [],
    })),
  }));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={pillarsWithSubthemes} />
    </div>
  );
}
