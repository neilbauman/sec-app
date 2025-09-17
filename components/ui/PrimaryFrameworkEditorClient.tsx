"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  theme_id: string;
}

interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFramework = async () => {
      // Step 1: Fetch pillars
      const { data: pillarsData, error: pillarsError } = await supabase
        .from("pillars")
        .select("*")
        .order("sort_order", { ascending: true });

      if (pillarsError) {
        console.error("Error fetching pillars:", pillarsError);
        setLoading(false);
        return;
      }

      // Step 2: Fetch themes
      const { data: themesData, error: themesError } = await supabase
        .from("themes")
        .select("*")
        .order("sort_order", { ascending: true });

      if (themesError) {
        console.error("Error fetching themes:", themesError);
        setLoading(false);
        return;
      }

      // Step 3: Fetch subthemes
      const { data: subthemesData, error: subthemesError } = await supabase
        .from("subthemes")
        .select("*")
        .order("sort_order", { ascending: true });

      if (subthemesError) {
        console.error("Error fetching subthemes:", subthemesError);
        setLoading(false);
        return;
      }

      // Step 4: Manually join
      const pillarsWithRelations = (pillarsData || []).map((pillar) => {
        const pillarThemes = (themesData || [])
          .filter((t) => t.pillar_id === pillar.id)
          .map((theme) => {
            const themeSubthemes = (subthemesData || []).filter(
              (s) => s.theme_id === theme.id
            );
            return { ...theme, subthemes: themeSubthemes };
          });

        return { ...pillar, themes: pillarThemes };
      });

      setPillars(pillarsWithRelations);
      setLoading(false);
    };

    fetchFramework();
  }, []);

  if (loading) return <p>Loading framework data...</p>;

  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-4 bg-white shadow rounded-md">
        <p className="text-gray-600">No framework data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="p-4 bg-white shadow rounded-md">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          {/* Themes */}
          <div className="ml-4 mt-3 space-y-3">
            {pillar.themes?.map((theme) => (
              <div key={theme.id}>
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-gray-500">{theme.description}</p>

                {/* Subthemes */}
                <div className="ml-4 mt-2 space-y-2">
                  {theme.subthemes?.map((subtheme) => (
                    <div key={subtheme.id}>
                      <h4 className="font-medium">{subtheme.name}</h4>
                      <p className="text-gray-500">{subtheme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
