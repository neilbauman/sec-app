// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { PageHeader, CsvActions } from "@/lib/ui";

async function getData(): Promise<{
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  error?: string;
}> {
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
    // ✅ Explicitly specify correct FK relationship
    .select("*, themes!themes_pillar_id_fkey(*, subthemes(*))")
    .order("sort_order", { ascending: true });

  return {
    pillars: (data as any) || [],
    error: error?.message,
  };
}

export default async function Page() {
  const { pillars, error } = await getData();

  return (
    <div className="p-6 space-y-4">
      {/* Page Header with breadcrumb + CSV actions */}
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbItems={[
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      {/* Framework Editor */}
      <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
    </div>
  );
}
