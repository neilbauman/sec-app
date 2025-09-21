// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import type { NestedPillar } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); // track row being modified

  // expand / collapse
  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  const expandAll = () => {
    const nextP: Record<string, boolean> = {};
    const nextT: Record<string, boolean> = {};
    pillars.forEach((p) => {
      nextP[p.id] = true;
      p.themes.forEach((t) => (nextT[t.id] = true));
    });
    setOpenPillars(nextP);
    setOpenThemes(nextT);
  };
  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Add / Remove (async) ----------
  async function handleAddPillar() {
    setLoading("pillar:add");
    try {
      const updated = await addPillar(pillars);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to add pillar:", err);
      alert("Error adding pillar");
    } finally {
      setLoading(null);
    }
  }

  async function handleAddTheme(pillarId: string) {
    setLoading(`pillar:${pillarId}:theme:add`);
    try {
      const updated = await addTheme(pillars, pillarId);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to add theme:", err);
      alert("Error adding theme");
    } finally {
      setLoading(null);
    }
  }

  async function handleAddSubtheme(pillarId: string, themeId: string) {
    setLoading(`theme:${themeId}:sub:add`);
    try {
      const updated = await addSubtheme(pillars, pillarId, themeId);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to add subtheme:", err);
      alert("Error adding subtheme");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeletePillar(pillarId: string) {
    setLoading(`pillar:${pillarId}:del`);
    try {
      const updated = await removePillar(pillars, pillarId);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to delete pillar:", err);
      alert("Error deleting pillar");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteTheme(pillarId: string, themeId: string) {
    setLoading(`theme:${themeId}:del`);
    try {
      const updated = await removeTheme(pillars, pillarId, themeId);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to delete theme:", err);
      alert("Error deleting theme");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteSubtheme(
    pillarId: string,
    themeId: string,
    subId: string
  ) {
    setLoading(`sub:${subId}:del`);
    try {
      const updated = await removeSubtheme(pillars, pillarId, themeId, subId);
      setPillars(updated);
    } catch (err) {
      console.error("Failed to delete subtheme:", err);
      alert("Error deleting subtheme");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddPillar}
              disabled={loading === "pillar:add"}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Pillar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMode((s) => !s)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            {editMode ? "Editing" : "View Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th className="w-60">Type / Ref Code</th>
              <th className="min-w-[18rem]">Name / Description</th>
              <th className="w-20 text-center">Sort</th>
              <th className="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pillars.map((pillar) => {
              const pillarOpen = !!openPillars[pillar.id];
              return (
                <>
                  {/* Pillar row */}
                  <tr key={pillar.id} className="[&>td]:px-3 [&>td]:py-2">
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePillar(pillar.id)}
                          className="p-1 rounded hover:bg-gray-100"
                          aria-label={pillarOpen ? "Collapse Pillar" : "Expand Pillar"}
                        >
                          {pillarOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <Badge>Pillar</Badge>
                        <span className="text-xs text-gray-500">
                          {pillar.ref_code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{pillar.name}</div>
                      {pillar.description && (
                        <div className="text-xs text-gray-600">
                          {pillar.description}
                        </div>
                      )}
                    </td>
                    <td className="text-center">{pillar.sort_order}</td>
                    <td className="text-center">
                      {editMode && (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleAddTheme(pillar.id)}
                            disabled={loading === `pillar:${pillar.id}:theme:add`}
                            className="p-1 rounded hover:bg-blue-50"
                            aria-label="Add Theme"
                          >
                            <Plus className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeletePillar(pillar.id)}
                            disabled={loading === `pillar:${pillar.id}:del`}
                            className="p-1 rounded hover:bg-red-50"
                            aria-label="Delete Pillar"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Themes */}
                  {pillarOpen &&
                    pillar.themes.map((theme) => {
                      const themeOpen = !!openThemes[theme.id];
                      return (
                        <>
                          <tr
                            key={theme.id}
                            className="[&>td]:px-3 [&>td]:py-2"
                          >
                            <td>
                              <div className="flex items-center gap-2 pl-4">
                                <button
                                  onClick={() => toggleTheme(theme.id)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  aria-label={themeOpen ? "Collapse Theme" : "Expand Theme"}
                                >
                                  {themeOpen ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                <Badge variant="success">Theme</Badge>
                                <span className="text-xs text-gray-500">
                                  {theme.ref_code}
                                </span>
                              </div>
                            </td>
                            <td className="pl-4">
                              <div className="font-medium">{theme.name}</div>
                              {theme.description && (
                                <div className="text-xs text-gray-600">
                                  {theme.description}
                                </div>
                              )}
                            </td>
                            <td className="text-center">{theme.sort_order}</td>
                            <td className="text-center">
                              {editMode && (
                                <div className="flex gap-3 justify-center">
                                  <button
                                    onClick={() => handleAddSubtheme(pillar.id, theme.id)}
                                    disabled={loading === `theme:${theme.id}:sub:add`}
                                    className="p-1 rounded hover:bg-blue-50"
                                    aria-label="Add Subtheme"
                                  >
                                    <Plus className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTheme(pillar.id, theme.id)}
                                    disabled={loading === `theme:${theme.id}:del`}
                                    className="p-1 rounded hover:bg-red-50"
                                    aria-label="Delete Theme"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>

                          {/* Subthemes */}
                          {themeOpen &&
                            theme.subthemes.map((sub) => (
                              <tr
                                key={sub.id}
                                className="[&>td]:px-3 [&>td]:py-2"
                              >
                                <td>
                                  <div className="flex items-center gap-2 pl-8">
                                    <Badge variant="danger">Subtheme</Badge>
                                    <span className="text-xs text-gray-500">
                                      {sub.ref_code}
                                    </span>
                                  </div>
                                </td>
                                <td className="pl-8">
                                  <div className="font-medium">{sub.name}</div>
                                  {sub.description && (
                                    <div className="text-xs text-gray-600">
                                      {sub.description}
                                    </div>
                                  )}
                                </td>
                                <td className="text-center">
                                  {sub.sort_order}
                                </td>
                                <td className="text-center">
                                  {editMode && (
                                    <button
                                      onClick={() =>
                                        handleDeleteSubtheme(
                                          pillar.id,
                                          theme.id,
                                          sub.id
                                        )
                                      }
                                      disabled={loading === `sub:${sub.id}:del`}
                                      className="p-1 rounded hover:bg-red-50"
                                      aria-label="Delete Subtheme"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </>
                      );
                    })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
