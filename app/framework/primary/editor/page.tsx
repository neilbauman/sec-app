// app/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  // ✅ Await cookies() because it returns a Promise in Next 15
  const cookieStore = await cookies();

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op in server components
        },
        remove() {
          // no-op in server components
        },
      },
    }
  );

  // Fetch pillars → themes → subthemes
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
        code,
        sort_order,
        subthemes (
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
    console.error("Error loading pillars:", error.message);
    return (
      <div className="p-6 text-red-600">
        ❌ Failed to load pillars: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient
        pillars={
          pillars as (Pillar & {
            themes: (Theme & { subthemes: Subtheme[] })[];
          })[]
        }
      />
    </div>
  );
}
