import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id, name, code, description, sort_order,
      themes:themes_pillar_id_fkey (
        id, name, code, description, sort_order,
        subthemes:fk_subthemes_theme (
          id, name, code, description, sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data ?? []) as (Pillar & {
    themes: (Theme & { subthemes: Subtheme[] })[];
  })[];
}

export default async function PrimaryEditorPage() {
  const pillars = await getData();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <PrimaryFrameworkCards
          pillars={pillars}
          defaultOpen={false}
          actions={(item, level) => (
            <div className="text-sm text-gray-400">
              {level} actions placeholder
            </div>
          )}
        />
      </div>
    </main>
  );
}
