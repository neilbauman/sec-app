// /app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { PageHeader, CsvActions } from "@/lib/ui";
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

  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

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
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbItems={[
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_120px_120px] border-b pb-2 mb-4 text-sm font-semibold text-gray-600">
        <div>Name / Description</div>
        <div>Sort Order</div>
        <div className="text-right">Actions</div>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={
          enrichedPillars as (Pillar & {
            themes?: (Theme & { subthemes?: Subtheme[] })[];
          })[]
        }
      />
    </main>
  );
}
