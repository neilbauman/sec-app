"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Subtheme {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFramework = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("framework_pillars")
        .select(`
          id,
          name,
          themes (
            id,
            name,
            subthemes ( id, name )
          )
        `);

      if (error) {
        setError(error.message);
      } else {
        setPillars(data as Pillar[]);
      }
      setLoading(false);
    };

    fetchFramework();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading framework…</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      {pillars.map((pillar, i) => (
        <div key={pillar.id} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-700">
            Pillar {i + 1}: {pillar.name}
          </h3>

          {pillar.themes?.map((theme) => (
            <div key={theme.id} className="mt-4 ml-4">
              <p className="font-medium">{theme.name}</p>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {theme.subthemes?.map((sub) => (
                  <li key={sub.id}>{sub.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
