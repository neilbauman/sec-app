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
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
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

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [globalEdit, setGlobalEdit] = useState(false);
  const [rowEdit, setRowEdit] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ---------- Expand / Collapse ----------
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

  // ---------- Async helper ----------
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

  // ---------- Inline Editing ----------
  const handleFieldChange = (
    row: NestedPillar | NestedTheme | NestedSubtheme,
    field: "name" | "description",
    value: string
  ) =>
    runAsync(`${row.id}:update`, async () => {
      const updatedRow = { ...row, [field]: value };
      const updated = await updateRow(pillars, updatedRow);
      setPillars(updated);
      return updated;
    });

  const renderCell = (
    row: NestedPillar | NestedTheme | NestedSubtheme,
    field: "name" | "description",
    indent = 0
  ) => {
    const isEditing = globalEdit || rowEdit[row.id];
    if (isEditing) {
      return (
        <input
          type="text"
          defaultValue={row[field] || ""}
          className="w-full border rounded px-2 py-1 text-sm"
          style={{ marginLeft: indent }}
          onBlur={(e) => handleFieldChange(row, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      );
    }
    return (
      <div style={{ marginLeft: indent }}>
        {field === "name" ? (
          <div className="font-medium">{row.name}</div>
        ) : (
          row.description && (
            <div className="text-xs text-gray-600">{row.description}</div>
          )
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
            onClick={() => setGlobalEdit((s) => !s)}
          >
            {globalEdit ? "Global Edit On" : "Global Edit Off"}
          </Button>
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
              <th className="w-32 text-center">Actions</th>
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
                      {renderCell(pillar, "name")}
                      {renderCell(pillar, "description")}
                    </td>
                    <td className="text-center">{pillar.sort_order}</td>
                    <td className="text-center">
                      {editMode && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAddTheme(pillar.id)}
                            className="p-1 hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeletePillar(pillar.id)}
                            className="p-1 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() =>
                              setRowEdit((s) => ({
                                ...s,
                                [pillar.id]: !s[pillar.id],
                              }))
                            }
                            className="p-1 hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
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
                              {renderCell(theme, "name", 4)}
                              {renderCell(theme, "description", 4)}
                            </td>
                            <td className="text-center">{theme.sort_order}</td>
                            <td className="text-center">
                              {editMode && (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() =>
                                      handleAddSubtheme(pillar.id, theme.id)
                                    }
                                    className="p-1 hover:bg-blue-50"
                                  >
                                    <Plus className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteTheme(pillar.id, theme.id)
                                    }
                                    className="p-1 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setRowEdit((s) => ({
                                        ...s,
                                        [theme.id]: !s[theme.id],
                                      }))
                                    }
                                    className="p-1 hover:bg-gray-100"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
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
                                  {renderCell(sub, "name", 8)}
                                  {renderCell(sub, "description", 8)}
                                </td>
                                <td className="text-center">
                                  {sub.sort_order}
                                </td>
                                <td className="text-center">
                                  {editMode && (
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() =>
                                          handleDeleteSubtheme(
                                            pillar.id,
                                            theme.id,
                                            sub.id
                                          )
                                        }
                                        className="p-1 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          setRowEdit((s) => ({
                                            ...s,
                                            [sub.id]: !s[sub.id],
                                          }))
                                        }
                                        className="p-1 hover:bg-gray-100"
                                      >
                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </div>
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
