// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  PageHeader,
  Breadcrumb,
  CsvActions,
} from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function PrimaryFrameworkEditorPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: pillars } = await supabase
    .from("pillars")
    .select(
      `
        id,
        code,
        name,
        description,
        sort_order,
        themes (
          id,
          code,
          name,
          description,
          sort_order,
          subthemes (
            id,
            code,
            name,
            description,
            sort_order
          )
        )
      `
    )
    .order("sort_order", { ascending: true });

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
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={(pillars ?? []) as (Pillar & {
            themes: (Theme & { subthemes: Subtheme[] })[];
          })[]}
        />
      </div>
    </main>
  );
}
