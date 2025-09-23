"use client";

import { useState } from "react";
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
} from "@/lib/framework-actions";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [dirty, setDirty] = useState(false);

  // --------- Add Handlers ----------
  const handleAddPillar = async () => {
    const updated = await addPillar(pillars);
    setPillars(updated);
    setDirty(true);
  };

  const handleAddTheme = async (pillarId: string) => {
    const updated = await addTheme(pillars, pillarId);
    setPillars(updated);
    setDirty(true);
  };

  const handleAddSubtheme = async (themeId: string) => {
    const updated = await addSubtheme(pillars, themeId);
    setPillars(updated);
    setDirty(true);
  };

  // --------- Remove Handlers ----------
  const handleRemovePillar = async (pillarId: string) => {
    const updated = await removePillar(pillars, pillarId);
    setPillars(updated);
    setDirty(true);
  };

  const handleRemoveTheme = async (themeId: string) => {
    const updated = await removeTheme(pillars, themeId);
    setPillars(updated);
    setDirty(true);
  };

  const handleRemoveSubtheme = async (subId: string) => {
    const updated = await removeSubtheme(pillars, subId);
    setPillars(updated);
    setDirty(true);
  };

  // --------- Move Handlers ----------
  const handleMovePillar = (pillarId: string, dir: "up" | "down") => {
    setPillars(movePillar(pillars, pillarId, dir));
    setDirty(true);
  };

  const handleMoveTheme = (pillarId: string, themeId: string, dir: "up" | "down") => {
    setPillars(moveTheme(pillars, pillarId, themeId, dir));
    setDirty(true);
  };

  const handleMoveSubtheme = (themeId: string, subId: string, dir: "up" | "down") => {
    setPillars(moveSubtheme(pillars, themeId, subId, dir));
    setDirty(true);
  };

  // --------- Save Handler ----------
  const handleSave = () => {
    // TODO: wire up to persist to DB
    console.log("Saving framework:", pillars);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="rounded-md bg-yellow-50 border border-yellow-300 p-2 text-sm text-yellow-800">
          Pending changes — items in <span className="text-red-600">red</span> will be regenerated on save.
          <div className="mt-2">
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border rounded-md p-4">
            {/* Pillar Row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-gray-500">{pillar.ref_code}</span>
                <div className="font-semibold">{pillar.name}</div>
                {pillar.description && (
                  <div className="text-sm text-gray-600">{pillar.description}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleMovePillar(pillar.id, "up")}>↑</Button>
                <Button size="sm" variant="outline" onClick={() => handleMovePillar(pillar.id, "down")}>↓</Button>
                <Button size="sm" variant="destructive" onClick={() => handleRemovePillar(pillar.id)}>Delete</Button>
              </div>
            </div>

            {/* Themes */}
            <div className="ml-6 mt-2 space-y-4">
              {pillar.themes.map((theme) => (
                <div key={theme.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-medium text-gray-500">{theme.ref_code}</span>
                      <div className="font-medium">{theme.name}</div>
                      {theme.description && (
                        <div className="text-sm text-gray-600">{theme.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleMoveTheme(pillar.id, theme.id, "up")}>↑</Button>
                      <Button size="sm" variant="outline" onClick={() => handleMoveTheme(pillar.id, theme.id, "down")}>↓</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveTheme(theme.id)}>Delete</Button>
                    </div>
                  </div>

                  {/* Subthemes */}
                  <div className="ml-6 mt-2 space-y-2">
                    {theme.subthemes.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center border rounded p-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">{sub.ref_code}</span>
                          <div>{sub.name}</div>
                          {sub.description && (
                            <div className="text-sm text-gray-600">{sub.description}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleMoveSubtheme(theme.id, sub.id, "up")}>↑</Button>
                          <Button size="sm" variant="outline" onClick={() => handleMoveSubtheme(theme.id, sub.id, "down")}>↓</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveSubtheme(sub.id)}>Delete</Button>
                        </div>
                      </div>
                    ))}

                    <Button size="sm" className="mt-2" onClick={() => handleAddSubtheme(theme.id)}>
                      + Add Subtheme
                    </Button>
                  </div>
                </div>
              ))}

              <Button size="sm" onClick={() => handleAddTheme(pillar.id)}>
                + Add Theme
              </Button>
            </div>
          </div>
        ))}

        <Button size="sm" onClick={handleAddPillar}>
          + Add Pillar
        </Button>
      </div>
    </div>
  );
}
