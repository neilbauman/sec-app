"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { getFrameworkTree, addPillar } from "@/lib/framework-client";
import { Plus } from "lucide-react";

interface Subtheme {
  id: string;
  name: string;
  description?: string;
}

interface Theme {
  id: string;
  name: string;
  description?: string;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  name: string;
  description?: string;
  themes: Theme[];
}

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);

  const refresh = async () => {
    const data = await getFrameworkTree();
    setPillars(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  async function handleAddPillar() {
    await addPillar({
      name: "New Pillar",
      description: "Description",
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader group="configuration" page="primary" />

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border-b last:border-0 pb-4 last:pb-0">
            <h2 className="font-semibold text-lg">{pillar.name}</h2>
            <p className="text-gray-600">{pillar.description}</p>

            <div className="ml-4 mt-2 space-y-2">
              {pillar.themes.map((theme) => (
                <div key={theme.id}>
                  <h3 className="font-medium">{theme.name}</h3>
                  <p className="text-gray-500">{theme.description}</p>

                  <ul className="ml-4 list-disc">
                    {theme.subthemes.map((sub) => (
                      <li key={sub.id}>
                        <span className="font-medium">{sub.name}</span> —{" "}
                        <span className="text-gray-500">{sub.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAddPillar}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Pillar
        </button>
      </div>
    </div>
  );
}
