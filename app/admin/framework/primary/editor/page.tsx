import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { PrimaryFrameworkCards } from "@/components/PrimaryFrameworkCards";
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
    return { pillars: [], error: error.message };
  }

  return { pillars: data as (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[], error: null };
}

export default async function Page() {
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

      <div className="p-6 space-y-4">
        {error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            Supabase error: {error}
          </div>
        ) : (
          <>
            {pillars.length > 0 ? (
              <PrimaryFrameworkCards
                pillars={pillars}
                defaultOpen={false}
                actions={(item, level) => (
                  <div className="flex gap-2 text-xs text-gray-400">
                    Custom actions here for {level}
                  </div>
                )}
              />
            ) : (
              <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-500">
                No pillars returned from Supabase.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
