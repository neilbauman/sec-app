// app/framework/primary/editor/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar } from "@/types/framework";

export default async function FrameworkPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => cookieStore,
    }
  );

  // ✅ Explicit joins to disambiguate the relationships
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(`
      id,
      code,
      name,
      description,
      sort_order,
      themes:themes!themes_pillar_id_fkey (
        id,
        code,
        name,
        description,
        sort_order,
        subthemes:subthemes!subthemes_theme_id_fkey (
          id,
          code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error fetching pillars:", error.message);
  }

  return (
    <div className="space-y-6">
      {/* ✅ Page header restored */}
      <PageHeader title="Primary Framework Editor" />

      {/* ✅ Breadcrumbs restored */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm p-4">
        <PrimaryFrameworkEditorClient pillars={(pillars as Pillar[]) ?? []} />
      </div>
    </div>
  );
}
