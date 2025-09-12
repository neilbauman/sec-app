"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabase() {
  const cookieStore = cookies();

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

export async function addPillar(pillar: {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
}) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("pillars")
    .insert([pillar])
    .select();

  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deletePillar(id: string) {
  const supabase = getSupabase();

  const { error } = await supabase.from("pillars").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
