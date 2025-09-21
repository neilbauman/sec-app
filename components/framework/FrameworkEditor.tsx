// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
} from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";
import { getSupabaseClient } from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const supabase = getSupabaseClient();

  // ----- Save helpers -----
  async function saveUpdate(
    type: "pillar" | "theme" | "subtheme",
    id: string,
    updates: { name: string; description: string }
  ) {
    const { error } = await supabase
      .from(type + "s") // pillars, themes, subthemes
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error saving", error);
      alert("Save failed: " + error.message);
    }
  }

  // ----- Action handlers -----
  const onAddPillar = () => {
    const updated = addPillar(pillars);
    setPillars(updated);
  };

  const onAddTheme = (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
  };

  const onAddSubtheme = (pillarId: string, themeId: string) => {
    const updated = addSubtheme(pillars, pillarId, themeId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
    setOpenThemes((s) => ({ ...s, [themeId]: true }));
  };

  const onRemovePillar = (pillarId: string) => {
    setPillars(removePillar(pillars, pillarId));
  };

  const onRemoveTheme = (pillarId: string, themeId: string) => {
    setPillars(removeTheme(pillars, pillarId, themeId));
  };

  const onRemoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => {
    setPillars(removeSubtheme(pillars, pillarId, themeId, subthemeId));
  };

  // ----- Inline editing -----
  const startEdit = (
    id: string,
    currentName: string,
    currentDescription: string
  ) => {
    setEditRow(id);
    setEditName(currentName);
    setEditDescription(currentDescription);
  };

  const cancelEdit = () => {
    setEditRow(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = (type: "pillar" | "theme" | "subtheme", id: string) => {
    saveUpdate(type, id, { name: editName, description: editDescription });
    setPillars((prev) =>
      prev.map((p) => {
        if (type === "pillar" && p.id === id) {
          return { ...p, name: editName, description: editDescription };
        }
        return {
          ...p,
          themes: p.themes.map((t) => {
            if (type === "theme" && t.id === id) {
              return { ...t, name: editName, description: editDescription };
            }
            return {
              ...t,
              subthemes: t.subthemes.map((s) =>
                type === "subtheme" && s.id === id
                  ? { ...s, name: editName, description: editDescription }
                  : s
              ),
            };
          }),
        };
      })
    );
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="primary" onClick={onAddPillar}>
          + Add Pillar
        </Button>
      </div>

      <table className="min-w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="px-3 py-2 w-10"></th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Ref Code</th>
            <th className="px-3 py-2">Name & Description</th>
            <th className="px-3 py-2">Sort</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              {/* Pillar Row */}
              <tr className="border-t">
                <td className="px-3 py-2">
                  <button
                    onClick={() =>
                      setOpenPillars((s) => ({
                        ...s,
                        [pillar.id]: !s[pillar.id],
                      }))
                    }
                  >
                    {openPillars[pillar.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <Badge>Pillar</Badge>
                </td>
                <td className="px-3 py-2">{pillar.ref_code}</td>
                <td className="px-3 py-2">
                  {editRow === pillar.id ? (
                    <div>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="block w-full border rounded p-1 mb-1"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="block w-full border rounded p-1 text-sm text-gray-600"
                      />
                      <div className="flex gap-2 mt-1">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => saveEdit("pillar", pillar.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-sm text-gray-500">
                        {pillar.description}
                      </div>
                    </>
                  )}
                </td>
                <td className="px-3 py-2">{pillar.sort_order}</td>
                <td className="px-3 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      startEdit(pillar.id, pillar.name, pillar.description)
                    }
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemovePillar(pillar.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddTheme(pillar.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </td>
              </tr>

              {/* Themes */}
              {openPillars[pillar.id] &&
                pillar.themes.map((theme) => (
                  <React.Fragment key={theme.id}>
                    <tr className="border-t bg-gray-50">
                      <td className="px-3 py-2 pl-8">
                        <button
                          onClick={() =>
                            setOpenThemes((s) => ({
                              ...s,
                              [theme.id]: !s[theme.id],
                            }))
                          }
                        >
                          {openThemes[theme.id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="success">Theme</Badge>
                      </td>
                      <td className="px-3 py-2">{theme.ref_code}</td>
                      <td className="px-3 py-2">
                        {editRow === theme.id ? (
                          <div>
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="block w-full border rounded p-1 mb-1"
                            />
                            <textarea
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              className="block w-full border rounded p-1 text-sm text-gray-600"
                            />
                            <div className="flex gap-2 mt-1">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => saveEdit("theme", theme.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-sm text-gray-500">
                              {theme.description}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="px-3 py-2">{theme.sort_order}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            startEdit(theme.id, theme.name, theme.description)
                          }
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveTheme(pillar.id, theme.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAddSubtheme(pillar.id, theme.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>

                    {/* Subthemes */}
                    {openThemes[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr className="border-t" key={sub.id}>
                          <td className="px-3 py-2 pl-16"></td>
                          <td className="px-3 py-2">
                            <Badge variant="danger">Subtheme</Badge>
                          </td>
                          <td className="px-3 py-2">{sub.ref_code}</td>
                          <td className="px-3 py-2">
                            {editRow === sub.id ? (
                              <div>
                                <input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="block w-full border rounded p-1 mb-1"
                                />
                                <textarea
                                  value={editDescription}
                                  onChange={(e) =>
                                    setEditDescription(e.target.value)
                                  }
                                  className="block w-full border rounded p-1 text-sm text-gray-600"
                                />
                                <div className="flex gap-2 mt-1">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => saveEdit("subtheme", sub.id)}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={cancelEdit}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-sm text-gray-500">
                                  {sub.description}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-3 py-2">{sub.sort_order}</td>
                          <td className="px-3 py-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                startEdit(sub.id, sub.name, sub.description)
                              }
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemoveSubtheme(pillar.id, theme.id, sub.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
