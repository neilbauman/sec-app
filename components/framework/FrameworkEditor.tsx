// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  addPillar,
  removePillar,
  addTheme,
  removeTheme,
  addSubtheme,
  removeSubtheme,
  movePillar,
  moveTheme,
  moveSubtheme,
  updateRow,
} from "@/lib/framework-actions";
import { NestedPillar } from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [loading, setLoading] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  const runAsync = async <T,>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T | undefined> => {
    try {
      setLoading(key);
      const result = await fn();
      setPendingChanges(true);
      return result;
    } finally {
      setLoading(null);
    }
  };

  // ---------- CRUD ----------
  const handleAddPillar = () =>
    runAsync("pillar:add", async () => {
      const updated = await addPillar(pillars);
      setPillars(updated);
      return updated;
    });

  const handleRemovePillar = (pillarId: string) =>
    runAsync(`pillar:${pillarId}:remove`, async () => {
      const updated = await removePillar(pillars, pillarId);
      setPillars(updated);
      return updated;
    });

  const handleAddTheme = (pillarId: string) =>
    runAsync(`pillar:${pillarId}:theme:add`, async () => {
      const updated = await addTheme(pillars, pillarId);
      setPillars(updated);
      return updated;
    });

  const handleRemoveTheme = (pillarId: string, themeId: string) =>
    runAsync(`pillar:${pillarId}:theme:${themeId}:remove`, async () => {
      const updated = await removeTheme(pillars, pillarId, themeId);
      setPillars(updated);
      return updated;
    });

  // ✅ FIX: only 2 args now
  const handleAddSubtheme = (themeId: string) =>
    runAsync(`theme:${themeId}:sub:add`, async () => {
      const updated = await addSubtheme(pillars, themeId);
      setPillars(updated);
      return updated;
    });

  const handleRemoveSubtheme = (themeId: string, subId: string) =>
    runAsync(`theme:${themeId}:sub:${subId}:remove`, async () => {
      const updated = await removeSubtheme(pillars, themeId, subId);
      setPillars(updated);
      return updated;
    });

  // ---------- Moves ----------
  const handleMovePillar = (pillarId: string, dir: "up" | "down") =>
    runAsync(`pillar:${pillarId}:move:${dir}`, async () => {
      const updated = movePillar(pillars, pillarId, dir);
      setPillars(updated);
      return updated;
    });

  const handleMoveTheme = (
    pillarId: string,
    themeId: string,
    dir: "up" | "down"
  ) =>
    runAsync(`theme:${themeId}:move:${dir}`, async () => {
      const updated = moveTheme(pillars, pillarId, themeId, dir);
      setPillars(updated);
      return updated;
    });

  const handleMoveSubtheme = (
    themeId: string,
    subId: string,
    dir: "up" | "down"
  ) =>
    runAsync(`sub:${subId}:move:${dir}`, async () => {
      const updated = moveSubtheme(pillars, themeId, subId, dir);
      setPillars(updated);
      return updated;
    });

  // ---------- Updates ----------
  const handleUpdateRow = (
    row: { id: string; type: "pillar" | "theme" | "subtheme" },
    field: "name" | "description",
    value: string
  ) =>
    runAsync(`${row.type}:${row.id}:update`, async () => {
      const updated = await updateRow(pillars, row.type, row.id, {
        [field]: value,
      });
      setPillars(updated);
      return updated;
    });

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {pendingChanges && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          <strong>Note:</strong> Items shown in{" "}
          <span className="text-red-600 font-medium">red</span> will have their
          reference codes regenerated once you save.
        </div>
      )}

      {/* Table here ... unchanged */}
    </div>
  );
}
