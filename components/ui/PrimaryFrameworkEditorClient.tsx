"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework";
import type { Pillar } from "@/types/framework";

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFramework()
      .then(setPillars)
      .catch((err) => console.error("Framework fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading framework data...</p>;
  if (pillars.length === 0) return <p>No framework data found.</p>;

  return (
    <div className="space-y-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="p-4 bg-white shadow rounded-md">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          <p className="text-gray-600">{pillar.description}</p>

          <div className="ml-4 mt-3 space-y-3">
            {pillar.themes.map((theme) => (
              <div key={theme.id}>
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-gray-500">{theme.description}</p>

                <div className="ml-4 mt-2 space-y-2">
                  {theme.subthemes.map((sub) => (
                    <div key={sub.id}>
                      <h4 className="font-medium">{sub.name}</h4>
                      <p className="text-gray-500">{sub.description}</p>
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
