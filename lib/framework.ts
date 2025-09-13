// lib/framework.ts
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      ref_code,
      sort_order,
      themes (
        id,
        name,
        description,
        ref_code,
        sort_order,
        subthemes (
          id,
          name,
          description,
          ref_code,
          sort_order,
          indicators (
            id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Pillar[];
}
