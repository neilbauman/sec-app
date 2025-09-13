import { createClient } from "@/lib/supabase-server";

export async function fetchFramework() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("*");

  console.log("Pillars data:", data, "Error:", error);

  return data ?? [];
}
