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

  // ✅ Step 2: Fetch pillars + themes explicitly via FK
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      code,
      name,
      description,
      sort_order,
      themes:themes!fk_themes_pillar (
        id,
        code,
        name,
        description,
        sort_order
      )
    `)
    .order("sort_order", { ascending: true });

  console.log("Fetched pillars with themes:", JSON.stringify(pillars, null, 2));
  if (error) {
    console.error("Supabase error fetching pillars/themes:", error.message);
  }

  if (!pillars || pillars.length === 0) {
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
          pillars={
            (pillars ?? []) as (Pillar & { themes?: Theme[] })[]
          }
          actions={<></>}
        />
      </div>
    </main>
  );
}
