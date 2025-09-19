// app/configuration/primary/page.tsx
import { createClient } from "@/lib/supabase-server";
import FrameworkEditor from "@/components/framework/FrameworkEditor";

export default async function PrimaryFrameworkEditorPage() {
  const supabase = createClient();

  // Fetch pillars, themes, subthemes
  const { data: pillarsData, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      name,
      themes:themes(
        id,
        name,
        subthemes:subthemes(id, name)
      )
    `
    )
    .order("id");

  if (error) {
    console.error("Error loading pillars:", error);
  }

  return (
    <FrameworkEditor pillars={pillarsData || []} />
  );
}
