import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

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

  // Fetch nested data in one call
  const { data: pillars } = await supabase
    .from("pillars")
    .select(`
      id,
      code,
      name,
      description,
      sort_order,
      themes (
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
    .order("sort_order", { ascending: true });

  return (
    <main className="p-4">
      <div>
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={(pillars ?? []) as Pillar[]}
          themes={[] as Theme[]}      // not needed separately, they’re nested under pillars
          subthemes={[] as Subtheme[]} // not needed separately, they’re nested under themes
          actions={<></>}
        />
      </div>
    </main>
  );
}
