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
    .select("*, themes!themes_pillar_id_fkey(*, subthemes(*))");

  return {
    pillars: (data as any) || [],
    error: error?.message,
  };
}

export default async function Page() {
  const { pillars, error } = await getData();

  return (
    <div className="p-6 space-y-4">
      {/* Page Header with CSV placeholders */}
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={[{ name: "Admin", href: "/admin" }, { name: "Framework", href: "/admin/framework" }, { name: "Primary Editor" }]}
        actions={<CsvActions />}
      />

      <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
    </div>
  );
}
