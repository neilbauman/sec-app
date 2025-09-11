import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  // Fetch data with ordering
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
          actions={<></>} // no-op for now
        />
      </div>
    </main>
  );
}
