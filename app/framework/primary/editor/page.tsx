// app/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme } from "@/types/framework";

export default async function PrimaryFrameworkEditorPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // server actions don’t persist cookies here
        },
        remove() {
          // server actions don’t persist cookies here
        },
      },
    }
  );

  // ✅ Explicitly specify which FK to use for themes → pillars
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
        sort_order
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error loading pillars:", error.message);
    return (
      <div className="p-4">
        <div className="text-red-600">
          Failed to load pillars: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <PrimaryFrameworkEditorClient pillars={(pillars as (Pillar & { themes: Theme[] })[]) ?? []} />
      </div>
    </div>
  );
}
