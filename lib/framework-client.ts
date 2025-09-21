// ---------- Fetch framework (pillars → themes → subthemes) ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Fetch all pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;
  if (!pillars) return [];

  // Fetch all themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  // Fetch all subthemes
  const { data: subthemes, error: subError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subError) throw subError;

  // Build nested structure
  const nested: NestedPillar[] = (pillars || []).map((p, pIdx) => {
    const pillarThemes = (themes || [])
      .filter((t) => t.theme_id === p.id) // ✅ FK link
      .map((t, tIdx) => {
        const themeSubs = (subthemes || [])
          .filter((s) => s.theme_id === t.id) // ✅ FK link
          .map((s, sIdx) => ({
            ...s,
            ref_code: `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`,
          }));

        return {
          ...t,
          ref_code: `T${pIdx + 1}.${tIdx + 1}`,
          subthemes: themeSubs,
        };
      });

    return {
      ...p,
      ref_code: `P${pIdx + 1}`,
      themes: pillarThemes,
    };
  });

  return nested;
}
