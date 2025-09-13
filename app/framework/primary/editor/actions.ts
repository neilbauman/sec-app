"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabase() {
  // ❌ old: const cookieStore = await cookies();
  // ✅ fixed:
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op for server actions
        },
        remove() {
          // no-op for server actions
        },
      },
    }
  );
}

export async function addPillar(formData: FormData) {
  const supabase = getSupabase();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;

  // Count existing pillars for code + sort_order
  const { count } = await supabase
    .from("pillars")
    .select("*", { count: "exact", head: true });

  const nextSort = (count ?? 0) + 1;
  const newCode = `P${nextSort}`;

  const { data, error } = await supabase
    .from("pillars")
    .insert([
      {
        code: newCode,
        name,
        description: description || `Auto description for ${newCode}`,
        sort_order: nextSort,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePillar(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
