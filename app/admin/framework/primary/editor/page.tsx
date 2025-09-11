// app/admin/framework/primary/editor/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

export const dynamic = "force-dynamic";

async function getData(): Promise<{
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  error?: string;
}> {
  try {
    // ✅ cookies() is synchronous
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set() {
            // no-op on server
          },
          remove() {
            // no-op on server
          },
        },
      }
    );

    const { data, error } = await supabase.from("pillars").select(`
      id, name, description,
      themes (
        id, name, description,
        subthemes (id, name, description)
      )
    `);

    if (error) {
      console.error("Supabase query error:", error.message);
      return { pillars: [], error: error.message };
    }

    // ✅ Normalize missing subthemes into arrays
    const normalized = (data ?? []).map((pillar: any) => ({
      ...pillar,
      themes: (pillar.themes ?? []).map((theme: any) => ({
        ...theme,
        subthemes: theme.subthemes ?? [],
      })),
    }));

    return { pillars: normalized };
  } catch (err: any) {
    console.error("Unexpected error in getData:", err);
    return { pillars: [], error: err.message };
  }
}

export default async function Page() {
  const { pillars, error } = await getData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
    </div>
  );
}
