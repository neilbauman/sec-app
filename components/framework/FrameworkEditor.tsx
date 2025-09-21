"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editRow, setEditRow] = useState<string | null>(null);

  // ---------- Expand / Collapse ----------
  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  const expandAll = () => {
    const allPillars: Record<string, boolean> = {};
    const allThemes: Record<string, boolean> = {};
    pillars.forEach((p) => {
      allPillars[p.id] = true;
      p.themes.forEach((t) => (allThemes[t.id] = true));
    });
    setOpenPillars(allPillars);
    setOpenThemes(allThemes);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Inline Edit Save ----------
  const handleSave = (
    type: "pillar" | "theme" | "subtheme",
    id: string,
    field: "name" | "description",
    value: string,
    parentIds?: { pillarId?: string; themeId?: string }
  ) => {
    setPillars((prev) =>
      prev.map((pillar) => {
        if (type === "pillar" && pillar.id === id) {
          return { ...pillar, [field]: value };
        }
        if (type === "theme" && pillar.id === parentIds?.pillarId) {
          return {
            ...pillar,
            themes: pillar.themes.map((t) =>
              t.id === id ? { ...t, [field]: value } : t
            ),
          };
        }
        if (type === "subtheme" && pillar.id === parentIds?.pillarId) {
          return {
            ...pillar,
            themes: pillar.themes.map((t) =>
              t.id === parentIds.themeId
                ? {
                    ...t,
                    subthemes: t.subthemes.map((s) =>
                      s.id === id ? { ...s, [field]: value } : s
                    ),
                  }
                : t
            ),
          };
        }
        return pillar;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
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
          <div className="border rounded-md px-3 py-1 text-sm bg-slate-50">
            Bulk Edit (CSV upload/download)
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setPillars((prev) => addPillar(prev))
            }
          >
            + Add Pillar
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="w-12"></th>
            <th className="w-28">Type</th>
            <th className="w-28">Ref Code</th>
            <th>Name / Description</th>
            <th className="w-16 text-center">Sort</th>
            <th className="w-28 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <>
              {/* Pillar Row */}
              <tr key={pillar.id} className="border-b">
                <td>
                  <button onClick={() => togglePillar(pillar.id)}>
                    {openPillars[pillar.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td>
                  <Badge variant="default">Pillar</Badge>
                </td>
                <td>{pillar.ref_code}</td>
                <td>
                  {editRow === pillar.id ? (
                    <div>
                      <input
                        className="border rounded px-1 text-sm w-full mb-1"
                        value={pillar.name}
                        onChange={(e) =>
                          handleSave("pillar", pillar.id, "name", e.target.value)
                        }
                      />
                      <textarea
                        className="border rounded px-1 text-xs w-full text-slate-600"
                        value={pillar.description}
                        onChange={(e) =>
                          handleSave(
                            "pillar",
                            pillar.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-slate-500">
                        {pillar.description}
                      </div>
                    </div>
                  )}
                </td>
                <td className="text-center">{pillar.sort_order}</td>
                <td className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setPillars((prev) => addTheme(prev, pillar.id))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setPillars((prev) => removePillar(prev, pillar.id))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setEditRow(editRow === pillar.id ? null : pillar.id)
                    }
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>

              {/* Themes */}
              {openPillars[pillar.id] &&
                pillar.themes.map((theme) => (
                  <>
                    <tr key={theme.id} className="border-b bg-slate-50">
                      <td></td>
                      <td className="pl-6">
                        <Badge variant="success">Theme</Badge>
                      </td>
                      <td>{theme.ref_code}</td>
                      <td>
                        {editRow === theme.id ? (
                          <div>
                            <input
                              className="border rounded px-1 text-sm w-full mb-1"
                              value={theme.name}
                              onChange={(e) =>
                                handleSave("theme", theme.id, "name", e.target.value, {
                                  pillarId: pillar.id,
                                })
                              }
                            />
                            <textarea
                              className="border rounded px-1 text-xs w-full text-slate-600"
                              value={theme.description}
                              onChange={(e) =>
                                handleSave(
                                  "theme",
                                  theme.id,
                                  "description",
                                  e.target.value,
                                  { pillarId: pillar.id }
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-slate-500">
                              {theme.description}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="text-center">{theme.sort_order}</td>
                      <td className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setPillars((prev) => addSubtheme(prev, pillar.id, theme.id))
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setPillars((prev) => removeTheme(prev, pillar.id, theme.id))
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditRow(editRow === theme.id ? null : theme.id)
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>

                    {/* Subthemes */}
                    {openThemes[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr key={sub.id} className="border-b bg-slate-100">
                          <td></td>
                          <td className="pl-12">
                            <Badge variant="danger">Subtheme</Badge>
                          </td>
                          <td>{sub.ref_code}</td>
                          <td>
                            {editRow === sub.id ? (
                              <div>
                                <input
                                  className="border rounded px-1 text-sm w-full mb-1"
                                  value={sub.name}
                                  onChange={(e) =>
                                    handleSave(
                                      "subtheme",
                                      sub.id,
                                      "name",
                                      e.target.value,
                                      { pillarId: pillar.id, themeId: theme.id }
                                    )
                                  }
                                />
                                <textarea
                                  className="border rounded px-1 text-xs w-full text-slate-600"
                                  value={sub.description}
                                  onChange={(e) =>
                                    handleSave(
                                      "subtheme",
                                      sub.id,
                                      "description",
                                      e.target.value,
                                      { pillarId: pillar.id, themeId: theme.id }
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-xs text-slate-500">
                                  {sub.description}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="text-center">{sub.sort_order}</td>
                          <td className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setPillars((prev) =>
                                  removeSubtheme(prev, pillar.id, theme.id, sub.id)
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditRow(editRow === sub.id ? null : sub.id)
                              }
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
