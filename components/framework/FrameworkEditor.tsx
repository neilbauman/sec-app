// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Handlers
  const onAddPillar = () => {
    setPillars(addPillar(pillars));
  };

  const onAddTheme = (pillarId: string) => {
    setPillars(addTheme(pillars, pillarId));
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
  };

  const onAddSubtheme = (pillarId: string, themeId: string) => {
    setPillars(addSubtheme(pillars, pillarId, themeId));
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

  const togglePillar = (id: string) => {
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  };

  const toggleTheme = (id: string) => {
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));
  };

  const handleChange = (
    type: "pillar" | "theme" | "subtheme",
    pillarId: string,
    themeId: string | null,
    subthemeId: string | null,
    field: "name" | "description" | "sort_order",
    value: string
  ) => {
    setPillars((prev) =>
      prev.map((pillar) => {
        if (pillar.id !== pillarId) return pillar;
        if (type === "pillar") {
          return { ...pillar, [field]: value };
        }
        const themes = pillar.themes.map((theme) => {
          if (theme.id !== themeId) return theme;
          if (type === "theme") {
            return { ...theme, [field]: value };
          }
          const subthemes = theme.subthemes.map((sub) => {
            if (sub.id !== subthemeId) return sub;
            return { ...sub, [field]: value };
          });
          return { ...theme, subthemes };
        });
        return { ...pillar, themes };
      })
    );
  };

  const onSaveFramework = () => {
    const json = JSON.stringify(pillars, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "framework.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpenPillars({})}>
            Collapse All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setOpenPillars(
                pillars.reduce(
                  (acc, p) => ({ ...acc, [p.id]: true }),
                  {} as Record<string, boolean>
                )
              )
            }
          >
            Expand All
          </Button>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <>
              <Button size="sm" variant="default" onClick={onSaveFramework}>
                Save Framework
              </Button>
              <Button size="sm" variant="outline" onClick={onAddPillar}>
                + Add Pillar
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant={editMode ? "destructive" : "outline"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      <table className="w-full border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-1 text-left w-8"></th>
            <th className="px-2 py-1 text-left">Type</th>
            <th className="px-2 py-1 text-left">Ref Code</th>
            <th className="px-2 py-1 text-left">Name</th>
            <th className="px-2 py-1 text-left">Description</th>
            <th className="px-2 py-1 text-center">Sort</th>
            <th className="px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              <tr className="border-t">
                <td className="px-2">
                  <button onClick={() => togglePillar(pillar.id)}>
                    {openPillars[pillar.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </td>
                <td className="px-2">
                  <Badge>Pillar</Badge>
                </td>
                <td className="px-2">{pillar.ref_code}</td>
                <td className="px-2">
                  {editMode ? (
                    <input
                      className="border rounded px-1 w-full"
                      value={pillar.name}
                      onChange={(e) =>
                        handleChange("pillar", pillar.id, null, null, "name", e.target.value)
                      }
                    />
                  ) : (
                    pillar.name
                  )}
                </td>
                <td className="px-2">
                  {editMode ? (
                    <input
                      className="border rounded px-1 w-full"
                      value={pillar.description}
                      onChange={(e) =>
                        handleChange("pillar", pillar.id, null, null, "description", e.target.value)
                      }
                    />
                  ) : (
                    pillar.description
                  )}
                </td>
                <td className="px-2 text-center">{pillar.sort_order}</td>
                <td className="px-2 text-center flex gap-2 justify-center">
                  {editMode && (
                    <>
                      <button onClick={() => onAddTheme(pillar.id)}>
                        <Plus size={16} />
                      </button>
                      <button onClick={() => onRemovePillar(pillar.id)}>
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {openPillars[pillar.id] &&
                pillar.themes.map((theme) => (
                  <React.Fragment key={theme.id}>
                    <tr className="border-t bg-gray-50">
                      <td className="px-2 pl-6">
                        <button onClick={() => toggleTheme(theme.id)}>
                          {openThemes[theme.id] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-2">
                        <Badge variant="success">Theme</Badge>
                      </td>
                      <td className="px-2">{theme.ref_code}</td>
                      <td className="px-2">
                        {editMode ? (
                          <input
                            className="border rounded px-1 w-full"
                            value={theme.name}
                            onChange={(e) =>
                              handleChange("theme", pillar.id, theme.id, null, "name", e.target.value)
                            }
                          />
                        ) : (
                          theme.name
                        )}
                      </td>
                      <td className="px-2">
                        {editMode ? (
                          <input
                            className="border rounded px-1 w-full"
                            value={theme.description}
                            onChange={(e) =>
                              handleChange("theme", pillar.id, theme.id, null, "description", e.target.value)
                            }
                          />
                        ) : (
                          theme.description
                        )}
                      </td>
                      <td className="px-2 text-center">{theme.sort_order}</td>
                      <td className="px-2 text-center flex gap-2 justify-center">
                        {editMode && (
                          <>
                            <button onClick={() => onAddSubtheme(pillar.id, theme.id)}>
                              <Plus size={16} />
                            </button>
                            <button onClick={() => onRemoveTheme(pillar.id, theme.id)}>
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>

                    {openThemes[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr key={sub.id} className="border-t bg-gray-100">
                          <td className="px-2 pl-12" />
                          <td className="px-2">
                            <Badge variant="danger">Subtheme</Badge>
                          </td>
                          <td className="px-2">{sub.ref_code}</td>
                          <td className="px-2">
                            {editMode ? (
                              <input
                                className="border rounded px-1 w-full"
                                value={sub.name}
                                onChange={(e) =>
                                  handleChange("subtheme", pillar.id, theme.id, sub.id, "name", e.target.value)
                                }
                              />
                            ) : (
                              sub.name
                            )}
                          </td>
                          <td className="px-2">
                            {editMode ? (
                              <input
                                className="border rounded px-1 w-full"
                                value={sub.description}
                                onChange={(e) =>
                                  handleChange("subtheme", pillar.id, theme.id, sub.id, "description", e.target.value)
                                }
                              />
                            ) : (
                              sub.description
                            )}
                          </td>
                          <td className="px-2 text-center">{sub.sort_order}</td>
                          <td className="px-2 text-center flex gap-2 justify-center">
                            {editMode && (
                              <button onClick={() => onRemoveSubtheme(pillar.id, theme.id, sub.id)}>
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            )}
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
