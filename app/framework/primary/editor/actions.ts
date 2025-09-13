"use server";

import { createClient } from "@/lib/supabase-server";

export async function fetchFramework() {
  const supabase = createClient();

  console.log("🚀 Running minimal fetch...");

  const { data, error } = await supabase
    .from("pillars")
    .select("*");

  if (error) {
    console.error("❌ Supabase error:", error);
    return [];
  }

  console.log("✅ Pillars fetched:", data?.length ?? 0);
  console.dir(data, { depth: null });

  return data ?? [];
}
