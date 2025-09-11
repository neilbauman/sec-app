// app/admin/framework/primary/editor/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData(): Promise<{ pillars: Pillar[]; error?: string }> {
  try {
    // ✅ Correct: cookies() is synchronous in Next.js 13–15
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

    // ✅ Pull pillars with nested themes + subthemes
    const { data, error } = await supabase
      .from("pillars")
      .select(
        `
        id, code, name, description, sort_order,
        themes:themes_pillar_id_fkey (
          id, code, name, description, sort_order,
          subthemes:fk_subthemes_theme (
            id, code, name, description, sort_order
          )
        )
      `
      )
      .order("sort_order");

    if (error) {
      console.error("Supabase fetch error:", error);
      return { pillars: [], error: error.message };
    }

    return { pillars: (data as Pillar[]) ?? [] };
  } catch (err) {
    console.error("Unexpected error in getData:", err);
    return { pillars: [], error: "Unexpected error" };
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
      />

      <div className="p-6 space-y-6">
        {/* Debug Data */}
        <div className="card p-4">
          <h2 className="font-medium mb-2">Debug Data</h2>
          {error ? (
            <pre className="text-red-600 text-sm">{error}</pre>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Render cards */}
        {pillars.length > 0 ? (
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="flex space-x-2 text-sm text-gray-500">
                <button className="hover:text-gray-700">✏️ Edit</button>
                <button className="hover:text-gray-700">🗑️ Delete</button>
                <button className="hover:text-gray-700">➕ Add</button>
              </div>
            )}
          />
        ) : (
          <div className="text-sm text-gray-500">
            No pillars returned from Supabase.
          </div>
        )}
      </div>
    </main>
  );
}
