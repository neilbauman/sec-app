// app/framework/primary/editor/page.tsx
import { createClient } from "@/lib/supabase-server";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkEditorPage() {
  const supabase = await createClient(); // ✅ now awaited

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      code,
      sort_order,
      themes (
        id,
        name,
        description
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching pillars:", error.message);
    return <div>Error loading data</div>;
  }

  return <PrimaryFrameworkEditorClient initialPillars={pillars ?? []} />;
}
