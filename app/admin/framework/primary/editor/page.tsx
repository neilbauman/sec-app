// app/admin/framework/primary/editor/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

async function getData(): Promise<{
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  error?: string;
}> {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: () => ({
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        }),
      }
    );

    const { data, error } = await supabase
      .from("pillars")
      .select(
        `id, name, code, description, sort_order,
         themes(id, name, code, description, sort_order,
           subthemes(id, name, code, description, sort_order)
         )`
      )
      .order("sort_order");

    if (error) throw error;

    return { pillars: (data as any) || [] };
  } catch (err: any) {
    console.error("getData error:", err);
    return { pillars: [], error: err.message };
  }
}

export default async function PrimaryFrameworkEditorPage() {
  const { pillars, error } = await getData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      <div className="p-6 space-y-6">
        <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
      </div>
    </div>
  );
}
