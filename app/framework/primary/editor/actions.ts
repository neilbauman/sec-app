//
// ─── PILLARS ──────────────────────────────────────────────
//
export async function addPillar(pillar: {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
}) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("pillars").insert([pillar]).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deletePillar(id: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
