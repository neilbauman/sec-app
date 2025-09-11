// app/admin/framework/primary/editor/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";

async function getData(): Promise<{
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  error?: string;
}> {
  const cookieStore = await cookies(); // ✅ Next.js 15 needs await

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
    // ✅ explicitly tell Supabase which FK to use
    .select("*, themes!pillar_id(*, subthemes(*))");

  return {
    pillars: (data as (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[]) || [],
    error: error?.message,
  };
}

export default async function Page() {
  const { pillars, error } = await getData();

  return (
    <div className="p-4">
      <PrimaryFrameworkEditorClient pillars={pillars} error={error} />
    </div>
  );
}
