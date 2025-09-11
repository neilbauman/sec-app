import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar } from "@/types/framework";

export default async function Page() {
  // Next.js 15 requires awaiting cookies()
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

  // ✅ Step 1: Flat query (no nesting)
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  // Debug logs
  console.log("Fetched pillars:", JSON.stringify(pillars, null, 2));
  if (error) {
    console.error("Supabase error fetching pillars:", error.message);
  }

  if (!pillars || pillars.length === 0) {
    return (
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Primary Framework</h2>
        <p className="text-red-600 font-medium">
          ⚠ No pillars found in the database.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Check if your pillars table has data and that themes/subthemes are
          linked via UUIDs.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div>
        <PrimaryFrameworkCards
          defaultOpen={false}
          // For now, pass only pillars (without themes/subthemes)
          pillars={pillars as Pillar[]}
          actions={<></>}
        />
      </div>
    </main>
  );
}
