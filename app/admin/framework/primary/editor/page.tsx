// app/admin/framework/primary/editor/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  try {
    const cookieStore = cookies(); // no await here

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
      .order("sort_order");

    if (error) {
      console.error("Supabase error:", error.message);
      return { pillars: [], error: error.message };
    }

    return {
      pillars: data as (Pillar & {
        themes: (Theme & { subthemes: Subtheme[] })[];
      })[],
      error: null,
    };
  } catch (err: any) {
    console.error("Unexpected error in getData:", err);
    return { pillars: [], error: err.message || "Unknown error" };
  }
}

export default async function Page() {
  try {
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

        <div className="p-4 space-y-4">
          {/* Debug panel */}
          <div className="rounded-md border bg-white p-3">
            <h2 className="text-sm font-medium mb-2">Debug Data</h2>
            {error ? (
              <p className="text-sm text-red-600">Supabase error: {error}</p>
            ) : (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(pillars, null, 2)}
              </pre>
            )}
          </div>

          {pillars.length > 0 ? (
            <PrimaryFrameworkCards
              pillars={pillars}
              defaultOpen={false}
              actions={(item, level) => (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span>Edit {level}</span>
                  <span>|</span>
                  <span>Delete</span>
                </div>
              )}
            />
          ) : (
            <div className="rounded-md border bg-white p-3 text-sm text-gray-500">
              No pillars returned from Supabase.
            </div>
          )}
        </div>
      </main>
    );
  } catch (err: any) {
    console.error("Render crash:", err);
    return (
      <main className="min-h-dvh bg-gray-50 p-4">
        <h1 className="text-lg font-semibold text-red-600">
          Failed to render PrimaryFramework Editor
        </h1>
        <pre className="text-xs bg-gray-100 p-2 mt-2 rounded">
          {err.message || "Unknown render error"}
        </pre>
      </main>
    );
  }
}
