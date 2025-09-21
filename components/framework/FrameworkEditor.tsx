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
  updatePillar,
  updateTheme,
  updateSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
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

  // ---------- Inline Edit ----------
  const handleUpdate = async (
    type: "pillar" | "theme" | "subtheme",
    pillarId: string,
    themeId: string | null,
    subId: string | null,
    field: "name" | "description",
    value: string
  ) => {
    const key = `${type}:${field}:update`;
    await runAsync(key, async () => {
      let updated: NestedPillar[] = pillars;
      if (type === "pillar") {
        updated = await updatePillar(pillars, pillarId, { [field]: value });
      } else if (type === "theme" && themeId) {
        updated = await updateTheme(pillars, pillarId, themeId, { [field]: value });
      } else if (type === "subtheme" && themeId && subId) {
        updated = await updateSubtheme(pillars, pillarId, themeId, subId, { [field]: value });
      }
      setPillars(updated);
      return updated;
    });
  };

  const EditableText: React.FC<{
    value: string;
    placeholder: string;
    onSave: (val: string) => void;
    className?: string;
  }> = ({ value, placeholder, onSave, className }) => {
    const [local, setLocal] = useState(value);

    return (
      <input
        type="text"
        className={`w-full border rounded px-1 py-0.5 text-sm ${className || ""}`}
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onSave(local)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
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
                      {editMode ? (
                        <div className="space-y-1">
                          <EditableText
                            value={pillar.name}
                            placeholder="Pillar name"
                            onSave={(val) =>
                              handleUpdate("pillar", pillar.id, null, null, "name", val)
                            }
                            className="font-medium"
                          />
                          <EditableText
                            value={pillar.description || ""}
                            placeholder="Description"
                            onSave={(val) =>
                              handleUpdate("pillar", pillar.id, null, null, "description", val)
                            }
                            className="text-xs text-gray-600"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-medium">{pillar.name}</div>
                          {pillar.description && (
                            <div className="text-xs text-gray-600">
                              {pillar.description}
                            </div>
                          )}
                        </>
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
                              {editMode ? (
                                <div className="space-y-1">
                                  <EditableText
                                    value={theme.name}
                                    placeholder="Theme name"
                                    onSave={(val) =>
                                      handleUpdate("theme", pillar.id, theme.id, null, "name", val)
                                    }
                                    className="font-medium"
                                  />
                                  <EditableText
                                    value={theme.description || ""}
                                    placeholder="Description"
                                    onSave={(val) =>
                                      handleUpdate(
                                        "theme",
                                        pillar.id,
                                        theme.id,
                                        null,
                                        "description",
                                        val
                                      )
                                    }
                                    className="text-xs text-gray-600"
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="font-medium">{theme.name}</div>
                                  {theme.description && (
                                    <div className="text-xs text-gray-600">
                                      {theme.description}
                                    </div>
                                  )}
                                </>
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
                                  {editMode ? (
                                    <div className="space-y-1">
                                      <EditableText
                                        value={sub.name}
                                        placeholder="Subtheme name"
                                        onSave={(val) =>
                                          handleUpdate(
                                            "subtheme",
                                            pillar.id,
                                            theme.id,
                                            sub.id,
                                            "name",
                                            val
                                          )
                                        }
                                        className="font-medium"
                                      />
                                      <EditableText
                                        value={sub.description || ""}
                                        placeholder="Description"
                                        onSave={(val) =>
                                          handleUpdate(
                                            "subtheme",
                                            pillar.id,
                                            theme.id,
                                            sub.id,
                                            "description",
                                            val
                                          )
                                        }
                                        className="text-xs text-gray-600"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <div className="font-medium">{sub.name}</div>
                                      {sub.description && (
                                        <div className="text-xs text-gray-600">
                                          {sub.description}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </td>
                                <td className="text-center">{sub.sort_order}</td>
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
