"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ✅ Pillar insert
export async function addPillar(formData: FormData) {
  const name = formData.get("name") as string;
  let description = formData.get("description") as string | null;

  if (!description || description.trim() === "") {
    description = `Auto-generated description for ${name}`;
  }

  // Get Supabase client
  const cookieStore = cookies();
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

  // Find the current max sort_order
  const { data: existing, error: fetchError } = await supabase
    .from("pillars")
    .select("sort_order, code")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextSortOrder = existing?.[0]?.sort_order
    ? existing[0].sort_order + 1
    : 1;
  const nextCode = `P${nextSortOrder}`;

  const { error } = await supabase.from("pillars").insert([
    {
      name,
      description,
      sort_order: nextSortOrder,
      code: nextCode,
    },
  ]);

  if (error) throw error;
}
