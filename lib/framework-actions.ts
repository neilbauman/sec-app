// lib/framework-actions.ts
import { createClient } from "@/lib/supabase-browser";
import { Database } from "@/types/supabase";

type PillarInput = {
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();

  const { error } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
      },
    ]);

  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").delete().eq("id", id);

  if (error) throw error;
}

// -----------------------------
// Theme stubs
// -----------------------------
export async function deleteTheme(id: string) {
  console.log("Stub: deleteTheme not implemented yet. ID:", id);
  return { success: false, message: "deleteTheme not implemented" };
}

// -----------------------------
// Subtheme stubs
// -----------------------------
export async function deleteSubtheme(id: string) {
  console.log("Stub: deleteSubtheme not implemented yet. ID:", id);
  return { success: false, message: "deleteSubtheme not implemented" };
}
