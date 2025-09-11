import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  // await cookies() because it's async in Next.js 15
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

  const { data: pillars } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="p-4">
      <div>
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={(pillars ?? []) as Pillar[]}
          themes={(themes ?? []) as Theme[]}
          subthemes={(subthemes ?? []) as Subtheme[]}
          actions={<></>}
        />
      </div>
    </main>
  );
}
