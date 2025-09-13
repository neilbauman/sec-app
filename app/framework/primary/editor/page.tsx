// app/framework/primary/editor/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function PrimaryFrameworkEditorPage() {
  const cookieStore = await cookies(); // ✅ FIX: await it

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // no-op in server components
        },
        remove() {
          // no-op in server components
        },
      },
    }
  );

  let pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[] =
    [];
  let error: string | undefined;

  try {
    const { data, error: fetchError } = await supabase
      .from("pillars")
      .select(
        `
        id,
        name,
        description,
        code,
        sort_order,
        themes (
          id,
          name,
          description,
          subthemes (
            id,
            name,
            description
          )
        )
      `
      )
      .order("sort_order", { ascending: true });

    if (fetchError) {
      error = fetchError.message;
    } else if (data) {
      pillars = data as (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
    }
  } catch (err: any) {
    error = err.message || "Unexpected error loading pillars.";
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
      </div>
    </div>
  );
}
