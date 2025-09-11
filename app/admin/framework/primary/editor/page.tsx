// /app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value; // FIXED: call cookies() directly
        },
        set() {
          // no-op for server component
        },
        remove() {
          // no-op for server component
        },
      },
    }
  );

  // Fetch full hierarchy
  const { data: pillars } = await supabase
    .from("pillars")
    .select(
      `
      id, name, code, sort_order,
      themes (
        id, name, code, sort_order,
        subthemes (
          id, name, code, sort_order
        )
      )
    `
    )
    .order("sort_order", { ascending: true });

  return (pillars ?? []) as (Pillar & {
    themes: (Theme & { subthemes: Subtheme[] })[];
  })[];
}

export default async function PrimaryEditorPage() {
  const pillars = await getData();

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header with breadcrumb + CSV actions */}
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
