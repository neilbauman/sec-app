// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
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

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);

  // Track open/closed state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Expand/collapse all
  const expandAll = () => {
    const allP = Object.fromEntries(pillars.map((p) => [p.id, true]));
    const allT = Object.fromEntries(
      pillars.flatMap((p) => p.themes.map((t) => [t.id, true]))
    );
    setOpenPillars(allP);
    setOpenThemes(allT);
  };
  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // Add handlers
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

  // Remove handlers
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

  // Inline editing (local only)
  const handleInputChange = (
    pillarId: string,
    themeId: string | null,
    subthemeId: string | null,
    field: "name" | "description",
    value: string
  ) => {
    setPillars((prev) =>
      prev.map((p) => {
        if (p.id === pillarId) {
          if (themeId === null) {
            return { ...p, [field]: value };
          }
          return {
            ...p,
            themes: p.themes.map((t) => {
              if (t.id === themeId) {
                if (subthemeId === null) {
                  return { ...t, [field]: value };
                }
                return {
                  ...t,
                  subthemes: t.subthemes.map((s) =>
                    s.id === subthemeId ? { ...s, [field]: value } : s
                  ),
                };
              }
              return t;
            }),
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={expandAll}
            disabled={pillars.length === 0}
          >
            Expand All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={collapseAll}
            disabled={pillars.length === 0}
          >
            Collapse All
          </Button>
        </div>

        <div className="flex gap-2">
          {editMode && (
            <Button size="sm" variant="outline" onClick={onAddPillar}>
              + Add Pillar
            </Button>
          )}

          <div className="border rounded-md px-2 flex items-center text-sm bg-gray-50">
            Bulk Edit (CSV Upload/Download)
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMode((s) => !s)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left w-32">Type</th>
            <th className="px-3 py-2 text-left w-32">Ref Code</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2 text-center w-20">Sort</th>
            <th className="px-3 py-2 text-center w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              {/* Pillar row */}
              <tr className="border-t">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
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
                    <Badge variant="default">Pillar</Badge>
                  </div>
                </td>
                <td className="px-3 py-2">{pillar.ref_code}</td>
                <td className="px-3 py-2">
                  {editMode ? (
                    <input
                      className="w-full border px-1"
                      value={pillar.name}
                      onChange={(e) =>
                        handleInputChange(
                          pillar.id,
                          null,
                          null,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    pillar.name
                  )}
                </td>
                <td className="px-3 py-2">
                  {editMode ? (
                    <textarea
                      className="w-full border px-1"
                      value={pillar.description}
                      onChange={(e) =>
                        handleInputChange(
                          pillar.id,
                          null,
                          null,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    pillar.description
                  )}
                </td>
                <td className="px-3 py-2 text-center">{pillar.sort_order}</td>
                <td className="px-3 py-2 text-center flex justify-center gap-1">
                  {editMode && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAddTheme(pillar.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemovePillar(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>

              {/* Theme rows */}
              {openPillars[pillar.id] &&
                pillar.themes.map((theme) => (
                  <React.Fragment key={theme.id}>
                    <tr className="border-t">
                      <td className="px-3 py-2 pl-8">
                        <div className="flex items-center gap-1">
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
                          <Badge variant="success">Theme</Badge>
                        </div>
                      </td>
                      <td className="px-3 py-2">{theme.ref_code}</td>
                      <td className="px-3 py-2">
                        {editMode ? (
                          <input
                            className="w-full border px-1"
                            value={theme.name}
                            onChange={(e) =>
                              handleInputChange(
                                pillar.id,
                                theme.id,
                                null,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          theme.name
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {editMode ? (
                          <textarea
                            className="w-full border px-1"
                            value={theme.description}
                            onChange={(e) =>
                              handleInputChange(
                                pillar.id,
                                theme.id,
                                null,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          theme.description
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {theme.sort_order}
                      </td>
                      <td className="px-3 py-2 text-center flex justify-center gap-1">
                        {editMode && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onAddSubtheme(pillar.id, theme.id)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemoveTheme(pillar.id, theme.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>

                    {/* Subtheme rows */}
                    {openThemes[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr key={sub.id} className="border-t">
                          <td className="px-3 py-2 pl-16">
                            <Badge variant="danger">Subtheme</Badge>
                          </td>
                          <td className="px-3 py-2">{sub.ref_code}</td>
                          <td className="px-3 py-2">
                            {editMode ? (
                              <input
                                className="w-full border px-1"
                                value={sub.name}
                                onChange={(e) =>
                                  handleInputChange(
                                    pillar.id,
                                    theme.id,
                                    sub.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              sub.name
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {editMode ? (
                              <textarea
                                className="w-full border px-1"
                                value={sub.description}
                                onChange={(e) =>
                                  handleInputChange(
                                    pillar.id,
                                    theme.id,
                                    sub.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              sub.description
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {sub.sort_order}
                          </td>
                          <td className="px-3 py-2 text-center flex justify-center gap-1">
                            {editMode && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  onRemoveSubtheme(pillar.id, theme.id, sub.id)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Edit3 className="w-4 h-4" />
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
