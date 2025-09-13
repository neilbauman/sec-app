// app/framework/primary/editor/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";
import { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function PrimaryFrameworkEditorPage() {
  const cookieStore = cookies();

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: pillars, error } = await supabase
    .from("pillars")
    .select(
      `
      *,
      themes:themes(
        *,
        subthemes:subthemes(
          *,
          indicators:indicators(
            *,
            criteria_levels(*)
          )
        )
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching pillars:", error.message);
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Could not load pillars: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Primary Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={pillars as (Pillar & {
        themes: (Theme & { subthemes: Subtheme[] })[];
      })[]} />
    </div>
  );
}
