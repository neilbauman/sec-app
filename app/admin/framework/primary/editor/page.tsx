// /app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  const cookieStore = await cookies();

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

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id, name, code, description, sort_order,
      themes:themes_pillar_id_fkey (  -- 👈 replace with actual FK name
        id, name, code, description, sort_order,
        subthemes:subthemes_theme_id_fkey ( -- 👈 replace with actual FK name
          id, name, code, description, sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  return { pillars: pillars ?? [], error };
}

export default async function PrimaryEditorPage() {
  const { pillars, error } = await getData();

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
        <section className="rounded-md border bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700">Debug Data</h2>
          {error && (
            <div className="text-red-600 text-sm mb-2">
              Supabase error: {error.message}
            </div>
          )}
          <pre className="mt-2 max-h-64 overflow-x-auto overflow-y-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
            {JSON.stringify(pillars, null, 2)}
          </pre>
        </section>

        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={
              <div className="text-sm text-gray-400">
                Right-side actions placeholder
              </div>
            }
          />
        ) : (
          <div className="rounded-md border bg-white p-4 text-sm text-gray-500">
            No pillars returned from Supabase.
          </div>
        )}
      </div>
    </main>
  );
}
