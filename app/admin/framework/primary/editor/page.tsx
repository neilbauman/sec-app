// /app/admin/framework/primary/editor/page.tsx
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
        set() {
          // no-op on server
        },
        remove() {
          // no-op on server
        },
      },
    }
  );

  // Fetch pillars, themes, and subthemes with description + sort_order
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      code,
      description,
      sort_order,
      themes (
        id,
        name,
        code,
        description,
        sort_order,
        subthemes (
          id,
          name,
          code,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching pillars:", error);
    return [];
  }

  return (pillars ?? []) as (Pillar & {
    description?: string;
    themes: (Theme & { description?: string; subthemes: Subtheme[] })[];
  })[];
}

export default async function PrimaryEditorPage() {
  const pillars = await getData();

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header */}
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
          actions={
            <div className="text-sm text-gray-400">
              Right-side actions placeholder
            </div>
          }
        />
      </div>
    </main>
  );
}
