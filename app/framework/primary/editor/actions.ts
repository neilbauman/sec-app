"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
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

/**
 * Add a new pillar.
 * Auto-generates code + sort_order.
 * If description is empty, auto-generates a placeholder.
 */
export async function addPillar(formData: FormData) {
  const name = formData.get("name") as string;
  let description = formData.get("description") as string | null;

  if (!name) {
    throw new Error("Name is required");
  }

  if (!description || description.trim() === "") {
    description = `Auto-generated description for ${name}`;
  }

  const supabase = await getSupabase();

  // Find current count
  const { count } = await supabase
    .from("pillars")
    .select("*", { count: "exact", head: true });

  const newSortOrder = (count ?? 0) + 1;
  const newCode = `P${newSortOrder}`;

  const { data, error } = await supabase
    .from("pillars")
    .insert([
      {
        code: newCode,
        name,
        description,
        sort_order: newSortOrder,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data?.[0];
}
