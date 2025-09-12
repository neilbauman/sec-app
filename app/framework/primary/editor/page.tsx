import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import PageHeader from "@/components/PageHeader";
import CsvActions from "@/components/CsvActions";
import { Pillar, Theme, Subtheme } from "@/types/framework";

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
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Framework", href: "/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      <div className="bg-white rounded-lg shadow-sm p-4">
        <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
      </div>
    </div>
  );
}
