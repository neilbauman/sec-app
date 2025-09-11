// app/admin/framework/primary/editor/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData() {
  try {
    // ✅ Next.js 15: cookies() is async
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
            /* no-op for server */
          },
          remove() {
            /* no-op for server */
          },
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

      {/* Debug section */}
      <div className="mx-auto max-w-7xl space-y-4 p-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-gray-900">Debug Data</h2>
          {error ? (
            <p className="text-sm text-red-600">Supabase error: {error}</p>
          ) : (
            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-700">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Cards */}
        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="flex gap-2 text-sm text-gray-400">
                {/* ✅ fully customizable per row */}
                <button className="hover:text-blue-600">✏️ Edit</button>
                <button className="hover:text-red-600">🗑 Delete</button>
                {level !== "subtheme" && (
                  <button className="hover:text-green-600">➕ Add</button>
                )}
              </div>
            )}
          />
        ) : (
          <p className="text-gray-500">No pillars returned from Supabase.</p>
        )}
      </div>
    </main>
  );
}
