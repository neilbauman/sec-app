// app/admin/framework/primary/editor/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData(): Promise<{ pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[]; error?: string }> {
  try {
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
      return { pillars: [], error: error.message };
    }

    // ✅ Ensure consistent shape
    return {
      pillars: (data as any[]).map((pillar) => ({
        ...pillar,
        themes: (pillar.themes || []).map((theme: any) => ({
          ...theme,
          subthemes: theme.subthemes || [],
        })),
      })),
    };
  } catch (err) {
    console.error(err);
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
