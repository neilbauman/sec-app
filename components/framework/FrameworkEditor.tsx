"use client";

import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import {
  Pillar,
  Theme,
  Subtheme,
  fetchFramework,
} from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchFramework();
        setPillars(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({ name, description: "", sort_order: pillars.length + 1 });
    const data = await fetchFramework();
    setPillars(data);
  }

  async function handleAddTheme(pillarId: string) {
    const name = prompt("Enter theme name:");
    if (!name) return;
    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: 1,
    });
    const data = await fetchFramework();
    setPillars(data);
  }

  async function handleAddSubtheme(themeId: string) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;
    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: 1,
    });
    const data = await fetchFramework();
    setPillars(data);
  }

  async function handleDeletePillar(id: string) {
    if (!confirm("Delete this pillar?")) return;
    await deletePillar(id);
    const data = await fetchFramework();
    setPillars(data);
  }

  async function handleDeleteTheme(id: string) {
    if (!confirm("Delete this theme?")) return;
    await deleteTheme(id);
    const data = await fetchFramework();
    setPillars(data);
  }

  async function handleDeleteSubtheme(id: string) {
    if (!confirm("Delete this subtheme?")) return;
    await deleteSubtheme(id);
    const data = await fetchFramework();
    setPillars(data);
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Framework Editor"
        description="Manage pillars, themes, and subthemes."
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Framework" }]}
      />

      <button
        onClick={handleAddPillar}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Add Pillar
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{pillar.name}</h2>
                <button
                  onClick={() => handleDeletePillar(pillar.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => handleAddTheme(pillar.id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                + Add Theme
              </button>

              <div className="ml-4 mt-2 space-y-2">
                {pillar.themes?.map((theme: Theme) => (
                  <div key={theme.id} className="border rounded p-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{theme.name}</h3>
                      <button
                        onClick={() => handleDeleteTheme(theme.id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddSubtheme(theme.id)}
                      className="mt-1 px-2 py-1 bg-purple-600 text-white rounded text-xs"
                    >
                      + Add Subtheme
                    </button>

                    <ul className="ml-4 mt-1 list-disc text-sm">
                      {theme.subthemes?.map((s: Subtheme) => (
                        <li key={s.id} className="flex justify-between">
                          <span>{s.name}</span>
                          <button
                            onClick={() => handleDeleteSubtheme(s.id)}
                            className="text-red-600 text-xs"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
