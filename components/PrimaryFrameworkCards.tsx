// /app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";
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
        set() {
          // no-op for server component
        },
        remove() {
          // no-op for server component
        },
      },
    }
  );

  const { data: pillars, error } = await supabase
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
    return { pillars: [], error: error.message };
  }

  return {
    pillars: (pillars ?? []) as (Pillar & {
      themes: (Theme & { subthemes: Subtheme[] })[];
    })[],
    error: null,
  };
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

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Debug Panel */}
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Debug Data</h2>
          {error ? (
            <p className="text-sm text-red-600">Supabase error: {error}</p>
          ) : (
            <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-600">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="text-xs text-gray-400">
                {level === "pillar" && "Pillar-specific actions"}
                {level === "theme" && "Theme-specific actions"}
                {level === "subtheme" && "Subtheme-specific actions"}
              </div>
            )}
          />
        ) : (
          <div className="rounded-lg border bg-white p-4 text-gray-500 shadow-sm">
            No pillars returned from Supabase.
          </div>
        )}
      </div>
    </main>
  );
}
