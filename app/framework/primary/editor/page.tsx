// app/framework/primary/editor/page.tsx

import { createClient } from "@/lib/supabase-server";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function FrameworkEditorPage() {
  const supabase = createClient();

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
        description,
        subthemes (
          id,
          name,
          description
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error.message);
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <PrimaryFrameworkEditorClient
          pillars={
            (pillars as (Pillar & {
              themes: (Theme & { subthemes: Subtheme[] })[];
            })[]) ?? []
          }
        />
      </div>
    </div>
  );
}
