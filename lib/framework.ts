// lib/framework.ts
import { createClient } from "@/lib/supabase-server";

export async function fetchFramework() {
  const supabase = createClient();

  // ✅ Start super simple: just grab pillars
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching pillars:", error);
    return [];
  }

  console.log("Fetched pillars:", data);
  return data ?? [];
}
