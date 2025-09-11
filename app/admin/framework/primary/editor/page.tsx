import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme } from "@/types/framework";

export default async function Page() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Step 1: Fetch pillars
  const { data: pillars, error: pillarsError } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarsError) {
    console.error("Supabase error fetching pillars:", pillarsError.message);
  }

  // Step 2: Fetch themes
  const { data: themes, error: themesError } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  if (themesError) {
    console.error("Supabase error fetching themes:", themesError.message);
  }

  // Step 3: Attach themes to pillars manually
  const enrichedPillars =
    pillars?.map((pillar) => ({
      ...pillar,
      themes: (themes ?? []).filter((t) => t.pillar_id === pillar.id),
    })) ?? [];

  console.log(
    "Merged pillars + themes:",
    JSON.stringify(enrichedPillars, null, 2)
  );

  if (!enrichedPillars || enrichedPillars.length === 0) {
    return (
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Primary Framework</h2>
        <p className="text-red-600 font-medium">⚠ No pillars found.</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div>
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={enrichedPillars as (Pillar & { themes?: Theme[] })[]}
          actions={<></>}
        />
      </div>
    </main>
  );
}
