// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import type {
  NestedPillar,
  NestedTheme,
  Subtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);

  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({
      name,
      description: "",
      sort_order: pillars.length + 1,
    });
    // simplest: reload to reflect DB state
    window.location.reload();
  }

  async function handleAddTheme(pillarId: string) {
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
    window.location.reload();
  }

  async function handleAddSubtheme(themeId: string) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;

    // find current count
    let count = 0;
    pillars.forEach((p) => {
      p.themes.forEach((t) => {
        if (t.id === themeId) count = t.subthemes.length;
      });
    });

    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Primary Framework"
        description="Manage pillars, themes, and subthemes."
        breadcrumb={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />

      <div className="mb-4">
        <button
          onClick={handleAddPillar}
          className="rounded bg-[#b7410e] px-3 py-2 text-white"
        >
          + Add Pillar
        </button>
      </div>

      <ul className="space-y-4">
        {pillars.map((pillar) => (
          <li key={pillar.id} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{pillar.name}</div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAddTheme(pillar.id)}
                  className="rounded bg-gray-100 px-2 py-1 text-sm"
                >
                  + Theme
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Delete pillar "${pillar.name}" and all its children?`
                      )
                    ) {
                      deletePillar(pillar.id).then(() =>
                        window.location.reload()
                      );
                    }
                  }}
                  className="rounded bg-red-100 px-2 py-1 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Themes */}
            {pillar.themes.length > 0 && (
              <ul className="mt-2 space-y-2 pl-4">
                {pillar.themes.map((theme: NestedTheme) => (
                  <li key={theme.id} className="rounded border p-2">
                    <div className="flex items-center justify-between">
                      <div>{theme.name}</div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAddSubtheme(theme.id)}
                          className="rounded bg-gray-100 px-2 py-1 text-sm"
                        >
                          + Subtheme
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete theme "${theme.name}"?`)) {
                              deleteTheme(theme.id).then(() =>
                                window.location.reload()
                              );
                            }
                          }}
                          className="rounded bg-red-100 px-2 py-1 text-sm text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Subthemes */}
                    {theme.subthemes.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-4">
                        {theme.subthemes.map((s: Subtheme) => (
                          <li
                            key={s.id}
                            className="flex items-center justify-between rounded border p-2"
                          >
                            <span>{s.name}</span>
                            <button
                              onClick={() => {
                                if (confirm(`Delete subtheme "${s.name}"?`)) {
                                  deleteSubtheme(s.id).then(() =>
                                    window.location.reload()
                                  );
                                }
                              }}
                              className="rounded bg-red-100 px-2 py-1 text-sm text-red-600"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
