// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Pencil,
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
  updateRow,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

type EditingRow =
  | { type: "pillar" | "theme" | "subtheme"; id: string }
  | null;

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [inlineAll, setInlineAll] = useState(false);
  const [editingRow, setEditingRow] = useState<EditingRow>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  // async wrapper
  async function runAsync<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T | null> {
    setLoading(key);
    setErrorMsg(null);
    try {
      return await fn();
    } catch (err: any) {
      console.error("Framework action failed:", err);
      setErrorMsg(err?.message || "Something went wrong.");
      return null;
    } finally {
      setLoading(null);
    }
  }

  // ---------- Add / Remove ----------
  const handleAddPillar = () =>
    runAsync("pillar:add", async () => {
      const updated = await addPillar(pillars);
      setPillars(updated);
      return updated;
    });

  const handleAddTheme = (pillarId: string) =>
    runAsync(`pillar:${pillarId}:theme:add`, async () => {
      const updated = await addTheme(pillars, pillarId);
      setPillars(updated);
      return updated;
    });

  const handleAddSubtheme = (pillarId: string, themeId: string) =>
    runAsync(`theme:${themeId}:sub:add`, async () => {
      const updated = await addSubtheme(pillars, pillarId, themeId);
      setPillars(updated);
      return updated;
    });

  const handleDeletePillar = (pillarId: string) =>
    runAsync(`pillar:${pillarId}:del`, async () => {
      const updated = await removePillar(pillars, pillarId);
      setPillars(updated);
      return updated;
    });

  const handleDeleteTheme = (pillarId: string, themeId: string) =>
    runAsync(`theme:${themeId}:del`, async () => {
      const updated = await removeTheme(pillars, pillarId, themeId);
      setPillars(updated);
      return updated;
    });

  const handleDeleteSubtheme = (
    pillarId: string,
    themeId: string,
    subId: string
  ) =>
    runAsync(`sub:${subId}:del`, async () => {
      const updated = await removeSubtheme(pillars, pillarId, themeId, subId);
      setPillars(updated);
      return updated;
    });

  // ---------- Update ----------
  const handleUpdate = (
    row: { type: "pillar" | "theme" | "subtheme"; id: string },
    field: "name" | "description",
    value: string
  ) =>
    runAsync(`${row.type}:${row.id}:update`, async () => {
      const updated = await updateRow(pillars, row.type, row.id, {
        [field]: value,
      });
      setPillars(updated);
      setEditingRow(null);
      return updated;
    });

  const renderNameDesc = (
    row: any,
    rowType: "pillar" | "theme" | "subtheme",
    indent = 0
  ) => {
    const isEditing =
      inlineAll || (editingRow?.id === row.id && editingRow?.type === rowType);

    if (isEditing) {
      return (
        <div className={`pl-${indent}`}>
          <input
            type="text"
            defaultValue={row.name}
            className="w-full border rounded px-2 py-1 text-sm mb-1"
            onBlur={(e) =>
              handleUpdate({ type: rowType, id: row.id }, "name", e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
          <textarea
            defaultValue={row.description || ""}
            className="w-full border rounded px-2 py-1 text-xs text-gray-600"
            onBlur={(e) =>
              handleUpdate(
                { type: rowType, id: row.id },
                "description",
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).blur();
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className={`pl-${indent}`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.name}</span>
          {editMode && !inlineAll && (
            <button
              onClick={() => setEditingRow({ type: rowType, id: row.id })}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Pencil className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
        {row.description && (
          <div className="text-xs text-gray-600">{row.description}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Top controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
          {editMode && (
            <Button
              size="sm"
              variant={inlineAll ? "default" : "outline"}
              onClick={() => setInlineAll((s) => !s)}
            >
              {inlineAll ? "Inline Edit All" : "Per-Row Editing"}
            </Button>
          )}
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
                          aria-label={
                            pillarOpen ? "Collapse Pillar" : "Expand Pillar"
                          }
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
                    <td>{renderNameDesc(pillar, "pillar", 0)}</td>
                    <td className="text-center">{pillar.sort_order}</td>
                    <td className="text-center">
                      {editMode && (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleAddTheme(pillar.id)}
                            disabled={
                              loading === `pillar:${pillar.id}:theme:add`
                            }
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
                          <tr key={theme.id} className="[&>td]:px-3 [&>td]:py-2">
                            <td>
                              <div className="flex items-center gap-2 pl-4">
                                <button
                                  onClick={() => toggleTheme(theme.id)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  aria-label={
                                    themeOpen ? "Collapse Theme" : "Expand Theme"
                                  }
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
                              {renderNameDesc(theme, "theme", 4)}
                            </td>
                            <td className="text-center">
                              {theme.sort_order}
                            </td>
                            <td className="text-center">
                              {editMode && (
                                <div className="flex gap-3 justify-center">
                                  <button
                                    onClick={() =>
                                      handleAddSubtheme(pillar.id, theme.id)
                                    }
                                    disabled={
                                      loading === `theme:${theme.id}:sub:add`
                                    }
                                    className="p-1 rounded hover:bg-blue-50"
                                    aria-label="Add Subtheme"
                                  >
                                    <Plus className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteTheme(pillar.id, theme.id)
                                    }
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
                              <tr key={sub.id} className="[&>td]:px-3 [&>td]:py-2">
                                <td>
                                  <div className="flex items-center gap-2 pl-8">
                                    <Badge variant="danger">Subtheme</Badge>
                                    <span className="text-xs text-gray-500">
                                      {sub.ref_code}
                                    </span>
                                  </div>
                                </td>
                                <td className="pl-8">
                                  {renderNameDesc(sub, "subtheme", 8)}
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
