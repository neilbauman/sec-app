"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ✅ Correct usage: cookies() is synchronous
const cookieStore = cookies();

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // no-op on server
        },
        remove() {
          // no-op on server
        },
      },
    }
  );
}

export async function addPillar({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const supabase = getSupabase();

  // Get count to compute next sort order and code
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
