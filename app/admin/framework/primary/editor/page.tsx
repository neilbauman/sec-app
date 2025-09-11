// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData(): Promise<{ pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[]; error?: string }> {
  // ✅ Correct usage: no await
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
          // no-op server
        },
        remove() {
          // no-op server
        },
      },
    }
  );

  const { data, error } = await supabase.from("pillars").select(`
    id,
    name,
    description,
    code,
    themes (
      id,
      name,
      description,
      code,
      subthemes (
        id,
        name,
        description,
        code
      )
    )
  `);

  if (error) {
    return { pillars: [], error: error.message };
  }

  // Normalize subthemes
  const pillars = (data as Pillar[]).map((pillar) => ({
    ...pillar,
    themes: pillar.themes.map((theme: Theme) => ({
      ...theme,
      subthemes: theme.subthemes ?? [],
    })),
  }));

  return { pillars };
}

export default async function PrimaryFrameworkEditorPage() {
  const { pillars, error } = await getData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework Editor"
        description="Manage pillars, themes, and subthemes"
        actions={<CsvActions endpoint="/api/export/pillars" />}
      />

      {error ? (
        <div className="text-red-500">Error loading pillars: {error}</div>
      ) : (
        <PrimaryFrameworkEditorClient pillars={pillars} />
      )}
    </div>
  );
}
