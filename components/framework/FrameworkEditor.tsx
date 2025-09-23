// components/framework/FrameworkEditor.tsx
"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
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
  movePillar,
  moveTheme,
  moveSubtheme,
  updateRow,
} from "@/lib/framework-actions";
import { recalcRefCodes } from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [original, setOriginal] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
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

  // ---------- Async Helper ----------
  async function runAsync<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
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

  const handleDeleteSubtheme = (pillarId: string, themeId: string, subId: string) =>
    runAsync(`sub:${subId}:del`, async () => {
      const updated = await removeSubtheme(pillars, pillarId, themeId, subId);
      setPillars(updated);
      return updated;
    });

  // ---------- Reorder ----------
  const handleMovePillar = (pillarId: string, dir: "up" | "down") =>
    setPillars((p) => movePillar(p, pillarId, dir));
  const handleMoveTheme = (pillarId: string, themeId: string, dir: "up" | "down") =>
    setPillars((p) => moveTheme(p, pillarId, themeId, dir));
  const handleMoveSubtheme = (pillarId: string, themeId: string, subId: string, dir: "up" | "down") =>
    setPillars((p) => moveSubtheme(p, pillarId, themeId, subId, dir));

  // ---------- Save ----------
  const handleSave = () =>
    runAsync("save", async () => {
      const recalculated = recalcRefCodes(pillars);
      // TODO: send to API to persist in DB
      setOriginal(recalculated);
      setPillars(recalculated);
      return recalculated;
    });

  // ---------- Dirty Check ----------
  const dirtyRefCodes = useMemo(() => {
    const map: Record<string, string> = {};
    const flatten = (nodes: NestedPillar[]) => {
      nodes.forEach((p) => {
        const orig = original.find((o) => o.id === p.id);
        if (orig && orig.ref_code !== p.ref_code) map[p.id] = p.ref_code;
        p.themes.forEach((t) => {
          const origT = orig?.themes.find((ot) => ot.id === t.id);
          if (origT && origT.ref_code !== t.ref_code) map[t.id] = t.ref_code;
          t.subthemes.forEach((s) => {
            const origS = origT?.subthemes.find((os) => os.id === s.id);
            if (origS && origS.ref_code !== s.ref_code) map[s.id] = s.ref_code;
          });
        });
      });
    };
    flatten(pillars);
    return map;
  }, [pillars, original]);

  const hasDirty = Object.keys(dirtyRefCodes).length > 0;

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Dirty ref code banner */}
      {hasDirty && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 text-sm">
          Items with <span className="text-red-500 font-semibold">red ref codes</span> will be regenerated once you save changes.
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
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddPillar}
                disabled={loading === "pillar:add"}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Pillar
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleSave}
                disabled={loading === "save"}
              >
                <Save className="w-4 h-4 mr-1" /> Save Changes
              </Button>
            </>
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
                          aria-label={pillarOpen ? "Collapse Pillar" : "Expand Pillar"}
                        >
                          {pillarOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <Badge>Pillar</Badge>
                        <span
                          className={`text-xs ${
                            dirtyRefCodes[pillar.id] ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          {pillar.ref_code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{pillar.name}</div>
                      {pillar.description && (
                        <div className="text-xs text-gray-600">{pillar.description}</div>
                      )}
                    </td>
                    <td className="text-center">{pillar.sort_order}</td>
                    <td className="text-center">
                      {editMode && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleMovePillar(pillar.id, "up")}
                            className="p-1 rounded hover:bg-gray-50"
                          >
                            <ArrowUp className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleMovePillar(pillar.id, "down")}
                            className="p-1 rounded hover:bg-gray-50"
                          >
                            <ArrowDown className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleAddTheme(pillar.id)}
                            className="p-1 rounded hover:bg-blue-50"
                          >
                            <Plus className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeletePillar(pillar.id)}
                            className="p-1 rounded hover:bg-red-50"
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
                                >
                                  {themeOpen ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                <Badge variant="success">Theme</Badge>
                                <span
                                  className={`text-xs ${
                                    dirtyRefCodes[theme.id] ? "text-red-500" : "text-gray-500"
                                  }`}
                                >
                                  {theme.ref_code}
                                </span>
                              </div>
                            </td>
                            <td className="pl-4">
                              <div className="font-medium">{theme.name}</div>
                              {theme.description && (
                                <div className="text-xs text-gray-600">{theme.description}</div>
                              )}
                            </td>
                            <td className="text-center">{theme.sort_order}</td>
                            <td className="text-center">
                              {editMode && (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleMoveTheme(pillar.id, theme.id, "up")}
                                    className="p-1 rounded hover:bg-gray-50"
                                  >
                                    <ArrowUp className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveTheme(pillar.id, theme.id, "down")}
                                    className="p-1 rounded hover:bg-gray-50"
                                  >
                                    <ArrowDown className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => handleAddSubtheme(pillar.id, theme.id)}
                                    className="p-1 rounded hover:bg-blue-50"
                                  >
                                    <Plus className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTheme(pillar.id, theme.id)}
                                    className="p-1 rounded hover:bg-red-50"
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
                                    <span
                                      className={`text-xs ${
                                        dirtyRefCodes[sub.id] ? "text-red-500" : "text-gray-500"
                                      }`}
                                    >
                                      {sub.ref_code}
                                    </span>
                                  </div>
                                </td>
                                <td className="pl-8">
                                  <div className="font-medium">{sub.name}</div>
                                  {sub.description && (
                                    <div className="text-xs text-gray-600">{sub.description}</div>
                                  )}
                                </td>
                                <td className="text-center">{sub.sort_order}</td>
                                <td className="text-center">
                                  {editMode && (
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() =>
                                          handleMoveSubtheme(pillar.id, theme.id, sub.id, "up")
                                        }
                                        className="p-1 rounded hover:bg-gray-50"
                                      >
                                        <ArrowUp className="w-4 h-4 text-gray-500" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleMoveSubtheme(pillar.id, theme.id, sub.id, "down")
                                        }
                                        className="p-1 rounded hover:bg-gray-50"
                                      >
                                        <ArrowDown className="w-4 h-4 text-gray-500" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteSubtheme(pillar.id, theme.id, sub.id)
                                        }
                                        className="p-1 rounded hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
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
