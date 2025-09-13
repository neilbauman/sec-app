"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { v4 as uuidv4 } from "uuid";

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
        set() {
          // no-op
        },
        remove() {
          // no-op
        },
      },
    }
  );
}

/**
 * Add a new Pillar
 * Matches DB schema: id (uuid), code (text), name (text), description (text), sort_order (int)
 */
export async function addPillar(formData: FormData) {
  const supabase = getSupabase();

  const name = (formData.get("name") as string)?.trim();
  let description = (formData.get("description") as string)?.trim();

  if (!name) {
    throw new Error("Name is required");
  }

  // Fetch current pillars to determine next code and sort order
  const { data: existing, error: fetchError } = await supabase
    .from("pillars")
    .select("code, sort_order")
    .order("sort_order", { ascending: true });

  if (fetchError) throw fetchError;

  const nextSort = existing?.length ? existing.length + 1 : 1;
  const nextCode = `P${nextSort}`;

  if (!description) {
    description = `Auto-generated description for ${name}`;
  }

  const { error: insertError } = await supabase.from("pillars").insert({
    id: uuidv4(),
    code: nextCode,
    name,
    description,
    sort_order: nextSort,
  });

  if (insertError) throw insertError;
}
