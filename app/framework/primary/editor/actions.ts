"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { Pillar } from "@/types/framework";

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}

export async function addPillar(formData: FormData): Promise<Pillar | null> {
  const supabase = getSupabase();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) ?? null;

  // ✅ Find current max sort order
  const { data: existing, error: fetchError } = await supabase
    .from("pillars")
    .select("sort_order, code");

  if (fetchError) throw fetchError;

  const sortOrder = (existing?.length ?? 0) + 1;
  const code = `P${sortOrder}`;

  const { data, error } = await supabase
    .from("pillars")
    .insert([
      {
        id: uuidv4(),
        name,
        description: description || `Auto description for ${name}`,
        code,
        sort_order: sortOrder,
      },
    ])
    .select("id, name, description, code, sort_order, themes")
    .single();

  if (error) throw error;

  return data as Pillar;
}
