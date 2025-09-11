// /app/admin/framework/primary/editor/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
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
          // no-op
        },
        remove() {
          // no-op
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
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      <div className="p-4">
        {/* Debug box */}
        <div className="mb-4 rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Debug Data</h2>
          {error ? (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-600">
              Supabase error: {error}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-all text-xs text-gray-600">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Safe rendering wrapper */}
        {(() => {
          try {
            return pillars.length > 0 ? (
              <PrimaryFrameworkCards
                pillars={pillars}
                defaultOpen={false}
                actions={(item, level) => (
                  <div className="text-sm text-gray-400">
                    Actions for {level}: {item.name}
                  </div>
                )}
              />
            ) : (
              <div className="rounded border bg-white p-4 text-gray-500">
                No pillars returned from Supabase.
              </div>
            );
          } catch (err) {
            return (
              <div className="rounded border border-red-300 bg-red-50 p-4 text-red-600">
                Render error: {String(err)}
              </div>
            );
          }
        })()}
      </div>
    </main>
  );
}
