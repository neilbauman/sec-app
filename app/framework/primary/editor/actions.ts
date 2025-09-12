"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabase() {
  // ✅ No await here — cookies() is synchronous
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // ✅ cookieStore is not a Promise — it’s a real ReadonlyRequestCookies
          return cookieStore.get(name)?.value;
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
  let description = formData.get("description") as string | null;

  if (!name) throw new Error("Name is required");
  if (!description || description.trim() === "") {
    description = `Auto-generated description for ${name}`;
  }

  // ✅ Get count of existing pillars
  const { count, error: countError } = await supabase
    .from("pillars")
    .select("*", { count: "exact", head: true });

  if (countError) throw new Error(countError.message);

  const newSortOrder = (count ?? 0) + 1;
  const newCode = `P${newSortOrder}`;

  // ✅ Insert new pillar
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
