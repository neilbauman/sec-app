// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import type { NestedPillar, NestedTheme, Subtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";

// Badge component
function TypeBadge({ type }: { type: "pillar" | "theme" | "subtheme" }) {
  const styles: Record<string, string> = {
    pillar: "bg-blue-100 text-blue-800",
    theme: "bg-green-100 text-green-800",
    subtheme: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    pillar: "Pillar",
    theme: "Theme",
    subtheme: "Subtheme",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

// Ref code generator
function generateRefCode(
  type: "pillar" | "theme" | "subtheme",
  indices: number[]
): string {
  if (type === "pillar") return `P${indices[0]}`;
  if (type === "theme") return `T${indices[0]}.${indices[1]}`;
  return `ST${indices[0]}.${indices[1]}.${indices[2]}`;
}

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handlers
  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({ name, description: "", sort_order: pillars.length + 1 });
    window.location.reload();
  }

  async function handleAddTheme(pillarId: string, count: number) {
    const name = prompt("Enter theme name:");
    if (!name) return;
    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  async function handleAddSubtheme(themeId: string, count: number) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;
    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  async function handleDelete(type: "pillar" | "theme" | "subtheme", id: string) {
    if (type === "pillar") await deletePillar(id);
    if (type === "theme") await deleteTheme(id);
    if (type === "subtheme") await deleteSubtheme(id);
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

      {/* Edit Mode Toggle */}
      <div className="mb-4 flex justify-between items-center">
        <Button
          variant={editMode ? "destructive" : "default"}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
        {editMode && (
          <Button onClick={handleAddPillar}>
            <Plus className="h-4 w-4 mr-1" /> Add Pillar
          </Button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow rounded text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 py-2 w-1/5">Type / Ref Code</th>
            <th className="px-3 py-2 w-2/5">Name / Description</th>
            <th className="px-3 py-2 w-1/5">Sort Order</th>
            <th className="px-3 py-2 w-1/5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar, pIdx) => {
            const ref = generateRefCode("pillar", [pillar.sort_order || pIdx + 1]);
            return (
              <>
                {/* Pillar Row */}
                <tr key={pillar.id} className="border-t">
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleExpand(pillar.id)}>
                        {expanded[pillar.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <TypeBadge type="pillar" />
                      <span className="text-xs text-gray-500">{ref}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-xs text-gray-600">{pillar.description}</div>
                  </td>
                  <td className="px-3 py-2">{pillar.sort_order}</td>
                  <td className="px-3 py-2">
                    {editMode && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAddTheme(pillar.id, pillar.themes.length)
                          }
                        >
                          + Theme
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete("pillar", pillar.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Themes */}
                {expanded[pillar.id] &&
                  pillar.themes.map((theme, tIdx) => {
                    const tref = generateRefCode("theme", [
                      pillar.sort_order || pIdx + 1,
                      theme.sort_order || tIdx + 1,
                    ]);
                    return (
                      <>
                        <tr
                          key={theme.id}
                          className="border-t bg-gray-50"
                        >
                          <td className="px-3 py-2 pl-10 align-top">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleExpand(theme.id)}>
                                {expanded[theme.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <TypeBadge type="theme" />
                              <span className="text-xs text-gray-500">{tref}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-gray-600">{theme.description}</div>
                          </td>
                          <td className="px-3 py-2">{theme.sort_order}</td>
                          <td className="px-3 py-2">
                            {editMode && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleAddSubtheme(theme.id, theme.subthemes.length)
                                  }
                                >
                                  + Subtheme
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete("theme", theme.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Subthemes */}
                        {expanded[theme.id] &&
                          theme.subthemes.map((s, sIdx) => {
                            const sref = generateRefCode("subtheme", [
                              pillar.sort_order || pIdx + 1,
                              theme.sort_order || tIdx + 1,
                              s.sort_order || sIdx + 1,
                            ]);
                            return (
                              <tr
                                key={s.id}
                                className="border-t"
                              >
                                <td className="px-3 py-2 pl-20 align-top">
                                  <div className="flex items-center gap-2">
                                    <TypeBadge type="subtheme" />
                                    <span className="text-xs text-gray-500">{sref}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-medium">{s.name}</div>
                                  <div className="text-xs text-gray-600">{s.description}</div>
                                </td>
                                <td className="px-3 py-2">{s.sort_order}</td>
                                <td className="px-3 py-2">
                                  {editMode && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete("subtheme", s.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </>
                    );
                  })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
