// lib/framework.ts
import { createClient } from "@/lib/supabase-server";

export async function fetchFramework() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  console.log("Supabase pillars result:", { data, error });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
