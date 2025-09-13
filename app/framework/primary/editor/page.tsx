// Fetch pillars → themes → subthemes
const { data: pillars, error } = await supabase
  .from("pillars")
  .select(`
    id,
    name,
    description,
    code,
    sort_order,
    themes!themes_pillar_id_fkey (   -- 👈 explicitly pick the FK
      id,
      name,
      description,
      code,
      sort_order,
      subthemes (
        id,
        name,
        description,
        code,
        sort_order
      )
    )
  `)
  .order("sort_order", { ascending: true });
