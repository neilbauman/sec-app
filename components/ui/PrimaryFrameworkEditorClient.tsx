"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
}

interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
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
      const { data, error } = await supabase
        .from("pillars")
        .select(`
          id, ref_code, name, description, sort_order,
          themes (
            id, ref_code, name, description, sort_order, pillar_id,
            subthemes (
              id, ref_code, name, description, sort_order, theme_id
            )
          )
        `)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching framework:", error);
      } else {
        setPillars(data || []);
      }

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
