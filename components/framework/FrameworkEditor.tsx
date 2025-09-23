// components/framework/FrameworkEditor.tsx
"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";

import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

import {
  cloneFramework,
  renumberAll,
  buildRefCodeMap,
  addPillarLocal,
  addThemeLocal,
  addSubthemeLocal,
  removePillarLocal,
  removeThemeLocal,
  removeSubthemeLocal,
  movePillarLocal,
  moveThemeLocal,
  moveSubthemeLocal,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

type RowKind = "pillar" | "theme" | "sub";

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  // Baseline = original data at first render (renumbered for safety)
  const baseline = useMemo(() => renumberAll(data), [data]);
  const baselineRefMap = useMemo(() => buildRefCodeMap(baseline), [baseline]);

  const [pillars, setPillars] = useState<NestedPillar[]>(baseline);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Current ref view + whether anything differs from baseline
  const currentRefMap = useMemo(() => buildRefCodeMap(pillars), [pillars]);
  const hasPendingRefChanges = useMemo(() => {
    const keys = new Set([
      ...Object.keys(baselineRefMap),
      ...Object.keys(currentRefMap),
    ]);
    for (const k of keys) {
      if (baselineRefMap[k] !== currentRefMap[k]) return true;
    }
    return false;
  }, [baselineRefMap, currentRefMap]);

  const unsaved =
    hasPendingRefChanges || JSON.stringify(pillars) !== JSON.stringify(baseline);

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

  // helpers
  function withUpdate(updater: (cur: NestedPillar[]) => NestedPillar[]) {
    setErrorMsg(null);
    setInfoMsg(null);
    setPillars((cur) => renumberAll(updater(cur)));
  }

  // add / remove
  const handleAddPillar = () => withUpdate(addPillarLocal);
  const handleAddTheme = (pillarId: string) =>
    withUpdate((cur) => addThemeLocal(cur, pillarId));
  const handleAddSubtheme = (themeId: string) =>
    withUpdate((cur) => addSubthemeLocal(cur, themeId));

  const handleDeletePillar = (pillarId: string) =>
    withUpdate((cur) => removePillarLocal(cur, pillarId));
  const handleDeleteTheme = (themeId: string) =>
    withUpdate((cur) => removeThemeLocal(cur, themeId));
  const handleDeleteSubtheme = (subId: string) =>
    withUpdate((cur) => removeSubthemeLocal(cur, subId));

  // move
  const handleMovePillar = (pillarId: string, dir: "up" | "down") =>
    withUpdate((cur) => movePillarLocal(cur, pillarId, dir));
  const handleMoveTheme = (themeId: string, dir: "up" | "down") =>
    withUpdate((cur) => moveThemeLocal(cur, themeId, dir));
  const handleMoveSub = (subId: string, dir: "up" | "down") =>
    withUpdate((cur) => moveSubthemeLocal(cur, subId, dir));

  // save / cancel
  const handleCancel = () => {
    setPillars(baseline);
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      const res = await fetch("/api/framework/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillars }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Save failed (${res.status})`);
      }
      setInfoMsg("Saved. Ref codes and order are now locked in.");
    } catch (err: any) {
      setErrorMsg(err?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // UI bits
  function RefCode({
    id,
    kind,
  }: {
    id: string;
    kind: RowKind;
  }): JSX.Element {
    const base = baselineRefMap[id];
    const cur = currentRefMap[id];
    const changed = base !== cur;

    return (
      <span
        className={`text-xs ${
          changed ? "text-red-600 font-medium" : "text-gray-500"
        }`}
        title={
          changed
            ? `${kind.toUpperCase()} ref code will change to ${cur} on Save`
            : `${kind.toUpperCase()} ref code`
        }
      >
        {base}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      {/* Subtle top note only when needed */}
      {unsaved && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Items with <span className="font-semibold text-red-600">red</span> ref
          codes will get new codes when you click Save.
        </div>
      )}

      {/* Error / info */}
      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {infoMsg}
        </div>
      )}

      {/* Top controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAddPillar}>
            <Plus className="mr-1 h-4 w-4" />
            Add Pillar
          </Button>
          {unsaved && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th className="w-64">Type / Ref Code</th>
              <th className="min-w-[22rem]">Name / Description</th>
              <th className="w-16 text-center">Sort</th>
              <th className="w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pillars.map((pillar) => {
              const pOpen = !!openPillars[pillar.id];
              return (
                <tr key={pillar.id} className="align-top">
                  {/* Pillar: Type / Ref */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePillar(pillar.id)}
                        className="rounded p-1 hover:bg-gray-100"
                        aria-label={pOpen ? "Collapse Pillar" : "Expand Pillar"}
                      >
                        {pOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <Badge>Pillar</Badge>
                      <RefCode id={pillar.id} kind="pillar" />
                    </div>

                    {/* THEMES rows (rendered inside first cell to keep table layout tidy) */}
                    {pOpen &&
                      pillar.themes.map((theme) => {
                        const tOpen = !!openThemes[theme.id];
                        return (
                          <div key={theme.id} className="mt-2 border-t pt-2">
                            <div className="flex items-center gap-2 pl-4">
                              <button
                                onClick={() => toggleTheme(theme.id)}
                                className="rounded p-1 hover:bg-gray-100"
                                aria-label={
                                  tOpen ? "Collapse Theme" : "Expand Theme"
                                }
                              >
                                {tOpen ? (
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-600" />
                                )}
                              </button>
                              <Badge variant="success">Theme</Badge>
                              <RefCode id={theme.id} kind="theme" />
                            </div>

                            {/* SUBTHEMES list (type/ref cell only renders the badges; the other columns below mirror) */}
                            {tOpen &&
                              theme.subthemes.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="mt-2 flex items-start pl-8"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge variant="danger">Subtheme</Badge>
                                    <RefCode id={sub.id} kind="sub" />
                                  </div>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </td>

                  {/* Pillar: Name / Description + nested rows */}
                  <td className="px-3 py-2">
                    <div className="font-medium">{pillar.name}</div>
                    {pillar.description && (
                      <div className="text-xs text-gray-600">
                        {pillar.description}
                      </div>
                    )}

                    {pOpen &&
                      pillar.themes.map((theme) => {
                        const tOpen = !!openThemes[theme.id];
                        return (
                          <div key={theme.id} className="mt-2 border-t pt-2">
                            <div className="pl-4">
                              <div className="font-medium">{theme.name}</div>
                              {theme.description && (
                                <div className="text-xs text-gray-600">
                                  {theme.description}
                                </div>
                              )}
                            </div>

                            {tOpen &&
                              theme.subthemes.map((sub) => (
                                <div key={sub.id} className="mt-2 pl-8">
                                  <div className="font-medium">{sub.name}</div>
                                  {sub.description && (
                                    <div className="text-xs text-gray-600">
                                      {sub.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </td>

                  {/* Pillar: Sort + nested sort cells */}
                  <td className="px-3 py-2 text-center align-top">
                    <div>{pillar.sort_order}</div>
                    {pOpen &&
                      pillar.themes.map((theme) => {
                        const tOpen = !!openThemes[theme.id];
                        return (
                          <div key={theme.id} className="mt-2 border-t pt-2">
                            <div className="pl-4 text-center">
                              {theme.sort_order}
                            </div>
                            {tOpen &&
                              theme.subthemes.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="mt-2 pl-8 text-center"
                                >
                                  {sub.sort_order}
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </td>

                  {/* Pillar: Actions + nested actions, aligned across levels */}
                  <td className="px-3 py-2 text-center align-top">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleMovePillar(pillar.id, "up")}
                        className="rounded p-1 hover:bg-gray-100"
                        aria-label="Move Pillar Up"
                      >
                        <ArrowUp className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleMovePillar(pillar.id, "down")}
                        className="rounded p-1 hover:bg-gray-100"
                        aria-label="Move Pillar Down"
                      >
                        <ArrowDown className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleAddTheme(pillar.id)}
                        className="rounded p-1 hover:bg-blue-50"
                        aria-label="Add Theme"
                      >
                        <Plus className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePillar(pillar.id)}
                        className="rounded p-1 hover:bg-red-50"
                        aria-label="Delete Pillar"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>

                    {pOpen &&
                      pillar.themes.map((theme) => {
                        const tOpen = !!openThemes[theme.id];
                        return (
                          <div
                            key={theme.id}
                            className="mt-2 border-t pt-2 text-center"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleMoveTheme(theme.id, "up")}
                                className="rounded p-1 hover:bg-gray-100"
                                aria-label="Move Theme Up"
                              >
                                <ArrowUp className="h-4 w-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() =>
                                  handleMoveTheme(theme.id, "down")
                                }
                                className="rounded p-1 hover:bg-gray-100"
                                aria-label="Move Theme Down"
                              >
                                <ArrowDown className="h-4 w-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() => handleAddSubtheme(theme.id)}
                                className="rounded p-1 hover:bg-blue-50"
                                aria-label="Add Subtheme"
                              >
                                <Plus className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteTheme(theme.id)}
                                className="rounded p-1 hover:bg-red-50"
                                aria-label="Delete Theme"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>

                            {tOpen &&
                              theme.subthemes.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="mt-2 pl-8 text-center"
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleMoveSub(sub.id, "up")
                                      }
                                      className="rounded p-1 hover:bg-gray-100"
                                      aria-label="Move Subtheme Up"
                                    >
                                      <ArrowUp className="h-4 w-4 text-gray-700" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleMoveSub(sub.id, "down")
                                      }
                                      className="rounded p-1 hover:bg-gray-100"
                                      aria-label="Move Subtheme Down"
                                    >
                                      <ArrowDown className="h-4 w-4 text-gray-700" />
                                    </button>
                                    {/* No "Add" at subtheme level by design */}
                                    <button
                                      onClick={() =>
                                        handleDeleteSubtheme(sub.id)
                                      }
                                      className="rounded p-1 hover:bg-red-50"
                                      aria-label="Delete Subtheme"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
