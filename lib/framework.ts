import { getSupabase } from "@/lib/supabase";

export type Pillar = { code: string; name: string; description?: string; };
export type Theme = { code: string; pillar_code: string; name: string; description?: string; };
export type Subtheme = { code: string; theme_code: string; name: string; description?: string; };

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

/**
 * By default we use mock data. Set USE_SUPABASE=1 to fetch real tables.
 */
export async function fetchFrameworkList(): Promise<FrameworkList> {
  if (process.env.USE_SUPABASE === "1") {
    const supabase = getSupabase();
    const [{ data: pillars, error: pe }, { data: themes, error: te }, { data: subthemes, error: se }] =
      await Promise.all([
        supabase.from("pillars").select("code,name,description").order("code"),
        supabase.from("themes").select("code,pillar_code,name,description").order("pillar_code").order("code"),
        supabase.from("subthemes").select("code,theme_code,name,description").order("theme_code").order("code")
      ]);

    if (pe || te || se) {
      throw new Error(
        `Supabase error: ${pe?.message || ""} ${te?.message || ""} ${se?.message || ""}`.trim()
      );
    }

    return {
      pillars: (pillars ?? []) as Pillar[],
      themes: (themes ?? []) as Theme[],
      subthemes: (subthemes ?? []) as Subtheme[]
    };
  }

  // Mock data
  return {
    pillars: [
      { code: "P1", name: "Safety", description: "People have a dwelling." },
      { code: "P2", name: "Dignity", description: "Privacy, tenure, protection." }
    ],
    themes: [
      { code: "T1.1", pillar_code: "P1", name: "Physical safety" },
      { code: "T1.2", pillar_code: "P1", name: "Overcrowding and privacy" },
      { code: "T2.1", pillar_code: "P2", name: "Habitability and health" }
    ],
    subthemes: [
      { code: "ST1.1.1", theme_code: "T1.1", name: "Adequate structure" },
      { code: "ST1.2.1", theme_code: "T1.2", name: "Sufficient space" },
      { code: "ST2.1.1", theme_code: "T2.1", name: "Ventilation" }
    ]
  };
}
