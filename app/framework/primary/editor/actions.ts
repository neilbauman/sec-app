"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ✅ Create supabase client for server actions
function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  );
}

// ✅ addPillar matches DB schema
export async function addPillar(formData: FormData) {
  const supabase = getSupabase();

  const name = (formData.get("name") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";

  // Get current max sort_order
  const { data: pillars, error: fetchError } = await supabase
    .from("pillars")
    .select("sort_order, code")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextSortOrder = pillars?.[0]?.sort_order
    ? pillars[0].sort_order + 1
    : 1;

  const nextCode = pillars?.[0]?.code
    ? `P${parseInt(pillars[0].code.replace("P", "")) + 1}`
    : "P1";

  const finalDescription =
    description.trim() === "" ? `Auto description for ${name}` : description;

  const { error: insertError } = await supabase.from("pillars").insert([
    {
      code: nextCode,
      name,
      description: finalDescription,
      sort_order: nextSortOrder,
    },
  ]);

  if (insertError) throw insertError;
}
