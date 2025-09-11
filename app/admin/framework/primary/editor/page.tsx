// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
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
          // server no-op
        },
        remove() {
          // server no-op
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id, name, code, description, sort_order,
      themes:themes_pillar_id_fkey (
        id, name, code, description, sort_order,
        subthemes:fk_subthemes_theme (
          id, name, code, description, sort_order
        )
      )
    `
    )
    .order("sort_order");

  if (error) {
    console.error("Supabase error:", error.message);
    return { pillars: [], error: error.message };
  }

  return { pillars: data as (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[], error: null };
}

export default async function PrimaryFrameworkEditorPage() {
  const { pillars, error } = await getData();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbItems={[
          { title: "Home", href: "/" },
          { title: "Admin", href: "/admin" },
          { title: "Framework", href: "/admin/framework" },
          { title: "Primary Editor", href: "/admin/framework/primary/editor" },
        ]}
        actions={<CsvActions />}
      />

      {/* Debug Data */}
      <section className="p-4">
        <div className="mb-4 rounded border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Debug Data</h2>
          {error ? (
            <div className="text-sm text-red-600">Supabase error: {error}</div>
          ) : (
            <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-700">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Main Data */}
        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="flex gap-2 justify-end text-sm text-gray-500">
                {/* Replace these placeholders with real handlers */}
                <button className="hover:text-blue-600">Edit</button>
                <button className="hover:text-red-600">Delete</button>
                {level !== "subtheme" && (
                  <button className="hover:text-green-600">Add</button>
                )}
              </div>
            )}
          />
        ) : (
          <div className="rounded border bg-white p-4 text-gray-500">
            No pillars returned from Supabase.
          </div>
        )}
      </section>
    </main>
  );
}
