// lib/framework.ts
import { getSupabaseClient } from "./supabase-server";
import type { Database } from "@/types/supabase";

export async function getFrameworkFlat() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("v_framework_flat")
    .select("*");

  if (error) throw error;
  return data as Database["public"]["Views"]["v_framework_flat"]["Row"][];
}
