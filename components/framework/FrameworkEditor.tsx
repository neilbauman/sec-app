"use client";

import { useState, useEffect } from "react";
import PageHeader from "../ui/PageHeader";
import {
  addPillar,
  addTheme,
  addSubtheme,
  fetchFramework,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import type { Pillar, Theme, Subtheme } from "@/lib/framework-client";

export default function FrameworkEditor({ data }: { data: Pillar[] }) {
  const [pillars, setPillars] = useState<Pillar[]>(data);

  useEffect(() => {
    setPillars(data);
  }, [data]);

  // Add a new pillar
  const handleAddPillar = async () => {
    const name = prompt("Enter pillar name:");
    if (!name) return;

    const ref_code = crypto.randomUUID(); // ✅ Generate unique ref_code

    await addPillar({
      ref_code,
      name,
      description: "",
      sort_order: pillars.length + 1,
    });

    const updated = await fetchFramework();
    setPillars(updated);
  };

  // Add a new theme under a pillar
  const handleAddTheme = async (pillarId: string) => {
    const name = prompt("Enter theme name:");
    if (!name) return;

    const pillar = pillars.find((p) => p.id === pillarId);
    const count = pillar?.themes?.length ?? 0;

    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: count + 1,
    });

    const updated = await fetchFramework();
    setPillars(updated);
  };

  // Add a subtheme under a theme
  const handleAddSubtheme = async (themeId: string) => {
    const name = prompt("Enter subtheme name:");
    if (!name) return;

    const theme = pillars.flatMap((p) => p.themes || []).find((t) => t.id === themeId);
    const count = theme?.subthemes?.length ?? 0;

    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });

    const updated = await fetchFramework();
    setPillars(updated);
  };

  return (
    <div>
      <PageHeader
        title="Framework Editor"
        description="Manage pillars, themes, and subthemes"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Configuration" },
          { label: "Framework Editor" },
        ]}
      />

      <button
        onClick={handleAddPillar}
        className="px-3 py-1 bg-[#b7410e] text-white rounded mb-4"
      >
        + Add Pillar
      </button>

      <ul>
        {pillars.map((pillar) => (
          <li key={pillar.id} className="mb-4">
            <div className="font-bold text-lg">{pillar.name}</div>
            <button
              onClick={() => handleAddTheme(pillar.id)}
              className="ml-2 text-sm text-blue-600"
            >
              + Add Theme
            </button>
            <button
              onClick={() => deletePillar(pillar.id)}
              className="ml-2 text-sm text-red-600"
            >
              Delete Pillar
            </button>

            <ul className="ml-6 mt-2">
              {pillar.themes?.map((theme) => (
                <li key={theme.id} className="mb-2">
                  <div className="font-semibold">{theme.name}</div>
                  <button
                    onClick={() => handleAddSubtheme(theme.id)}
                    className="ml-2 text-sm text-blue-600"
                  >
                    + Add Subtheme
                  </button>
                  <button
                    onClick={() => deleteTheme(theme.id)}
                    className="ml-2 text-sm text-red-600"
                  >
                    Delete Theme
                  </button>

                  <ul className="ml-6 mt-1">
                    {theme.subthemes?.map((s) => (
                      <li key={s.id} className="text-sm">
                        {s.name}
                        <button
                          onClick={() => deleteSubtheme(s.id)}
                          className="ml-2 text-xs text-red-600"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
