"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import PageHeader from "@/components/ui/PageHeader";

interface Subtheme {
  id: string;
  name: string;
  theme_id: string;
}

interface Theme {
  id: string;
  name: string;
  pillar_id: string;
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

  useEffect(() => {
    async function fetchFramework() {
      setLoading(true);
      const supabase = createClient();

      // Fetch pillars
      const { data: pillarsData, error: pillarsError } = await supabase
        .from("pillars")
        .select("*")
        .order("id");

      if (pillarsError) {
        console.error("Error fetching pillars:", pillarsError);
        setLoading(false);
        return;
      }

      // Fetch themes
      const { data: themesData, error: themesError } = await supabase
        .from("themes")
        .select("*")
        .order("id");

      if (themesError) {
        console.error("Error fetching themes:", themesError);
        setLoading(false);
        return;
      }

      // Fetch subthemes
      const { data: subthemesData, error: subthemesError } = await supabase
        .from("subthemes")
        .select("*")
        .order("id");

      if (subthemesError) {
        console.error("Error fetching subthemes:", subthemesError);
        setLoading(false);
        return;
      }

      // Nest data
      const structured = (pillarsData || []).map((pillar) => ({
        ...pillar,
        themes: (themesData || [])
          .filter((theme) => theme.pillar_id === pillar.id)
          .map((theme) => ({
            ...theme,
            subthemes: (subthemesData || []).filter(
              (sub) => sub.theme_id === theme.id
            ),
          })),
      }));

      setPillars(structured);
      setLoading(false);
    }

    fetchFramework();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading framework data…</p>
        ) : (
          <div className="space-y-6">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h2 className="text-lg font-semibold text-green-700 mb-2">
                  Pillar {idx + 1}: {pillar.name}
                </h2>

                {pillar.themes.map((theme) => (
                  <div key={theme.id} className="ml-4 mb-3">
                    <h3 className="font-medium text-gray-800">{theme.name}</h3>
                    <ul className="list-disc list-inside ml-4 text-gray-600">
                      {theme.subthemes.map((sub) => (
                        <li key={sub.id}>{sub.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
