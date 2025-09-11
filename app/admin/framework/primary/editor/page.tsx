// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  try {
    // ✅ Always await cookies() — returns a *synchronous* object but wrapped in a promise
    const cookieStore = await nextCookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore.get(name)?.value;
            } catch {
              return undefined;
            }
          },
          set() {
            /* no-op on server */
          },
          remove() {
            /* no-op on server */
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

    return {
      pillars: data as (Pillar & {
        themes: (Theme & { subthemes: Subtheme[] })[];
      })[],
      error: null,
    };
  } catch (err: any) {
    console.error("getData fatal error:", err);
    return { pillars: [], error: err?.message ?? "Unknown error" };
  }
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
          { label: "Primary Editor", href: "/admin/framework/primary/editor" },
        ]}
        actions={<CsvActions />}
      />

      <div className="p-6 space-y-6">
        {/* Debugging Panel */}
        <div className="rounded-md border bg-white shadow-sm p-4">
          <h2 className="text-sm font-semibold mb-2">Debug Data</h2>
          {error ? (
            <pre className="text-red-600">{error}</pre>
          ) : (
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Render Pillar Cards */}
        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => console.log("Edit", level, item.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => console.log("Delete", level, item.id)}
                >
                  Delete
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800 text-sm"
                  onClick={() => console.log("Add Child", level, item.id)}
                >
                  +
                </button>
              </div>
            )}
          />
        ) : (
          <div className="rounded-md border bg-white shadow-sm p-4 text-gray-500">
            {error
              ? "Error fetching data. Check debug panel above."
              : "No pillars returned from Supabase."}
          </div>
        )}
      </div>
    </main>
  );
}
