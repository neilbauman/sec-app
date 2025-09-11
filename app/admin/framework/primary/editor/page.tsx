import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

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

  // Fetch pillars
  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  // Fetch themes
  const { data: themes } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  // Fetch subthemes
  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  // Merge
  const enrichedPillars =
    pillars?.map((pillar) => ({
      ...pillar,
      themes: (themes ?? [])
        .filter((t) => t.pillar_id === pillar.id)
        .map((theme) => ({
          ...theme,
          subthemes: (subthemes ?? []).filter((s) => s.theme_id === theme.id),
        })),
    })) ?? [];

  return (
    <main className="p-6">
      {/* Page Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Primary Framework Editor
        </h1>
      </header>

      {/* Cards */}
      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={
          enrichedPillars as (Pillar & {
            themes?: (Theme & { subthemes?: Subtheme[] })[];
          })[]
        }
        actions={<></>}
      />
    </main>
  );
}
