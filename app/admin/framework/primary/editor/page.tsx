// /app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies as getCookies } from "next/headers";
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  const cookieStore = await getCookies(); // FIX: cookies() is async in Vercel

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

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id, name, code, description, sort_order,
      themes (
        id, name, code, description, sort_order,
        subthemes (
          id, name, code, description, sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  console.log(">>> Supabase error:", error);
  console.log(">>> Supabase pillars result:", JSON.stringify(pillars, null, 2));

  return (pillars ?? []) as (Pillar & {
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

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Debug output */}
        <section className="rounded-md border bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700">Debug Data</h2>
          <pre className="mt-2 max-h-64 overflow-x-auto overflow-y-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
            {JSON.stringify(pillars, null, 2)}
          </pre>
        </section>

        {/* Hierarchy table */}
        <PrimaryFrameworkCards
          pillars={pillars}
          defaultOpen={false}
          actions={<div className="text-sm text-gray-400">Right-side actions placeholder</div>}
        />
      </div>
    </main>
  );
}
