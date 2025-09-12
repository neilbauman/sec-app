"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies(); // ✅ await here

  return createServerClient(
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
}

export async function addPillar() {
  const supabase = await getSupabase();

  // Get count of existing pillars
  const { count, error: countError } = await supabase
    .from("pillars")
    .select("*", { count: "exact", head: true });

  if (countError) throw new Error(countError.message);

  const nextIndex = (count || 0) + 1;
  const newPillar = {
    code: `P${nextIndex}`, // auto-generate code
    name: `New Pillar ${nextIndex}`, // placeholder until edited
    description: "",
    sort_order: nextIndex,
  };

  const { data, error } = await supabase
    .from("pillars")
    .insert([newPillar])
    .select();

  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deletePillar(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
