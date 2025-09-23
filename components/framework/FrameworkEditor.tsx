// components/framework/FrameworkEditor.tsx
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
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(recalcRefCodes(initialPillars));
  const [dirty, setDirty] = useState(false);

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

  const handleAddSubtheme = async (pillarId: string, themeId: string) => {
    const updated = await addSubtheme(pillars, pillarId, themeId);
    setPillars(updated);
    setDirty(true);
  };

  const handleRemovePillar = async (pillarId: string) => {
    const updated = await removePillar(pillars, pillarId);
    setPillars(updated);
    setDirty(true);
  };

  const handleRemoveTheme = async (pillarId: string, themeId: string) => {
    const updated = await removeTheme(pillars, pillarId, themeId);
    setPillars(updated);
    setDirty(true);
  };

  const handleRemoveSubtheme = async (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => {
    const updated = await removeSubtheme(pillars, pillarId, themeId, subthemeId);
    setPillars(updated);
    setDirty(true);
  };

  const handleMovePillar = (pillarId: string, direction: "up" | "down") => {
    const updated = movePillar(pillars, pillarId, direction);
    setPillars(updated);
    setDirty(true);
  };

  const handleMoveTheme = (pillarId: string, themeId: string, direction: "up" | "down") => {
    const updated = moveTheme(pillars, pillarId, themeId, direction);
    setPillars(updated);
    setDirty(true);
  };

  const handleMoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string,
    direction: "up" | "down"
  ) => {
    const updated = moveSubtheme(pillars, pillarId, themeId, subthemeId, direction);
    setPillars(updated);
    setDirty(true);
  };

  const handleSave = () => {
    const renumbered = recalcRefCodes(cloneFramework(pillars));
    setPillars(renumbered);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200 text-sm">
          Items marked in <span className="text-red-600 font-semibold">red</span> will
          have their ref codes regenerated upon save.
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      )}

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="p-2 w-1/6">Type / Ref</th>
            <th className="p-2 w-1/3">Name</th>
            <th className="p-2 w-1/3">Description</th>
            <th className="p-2 w-1/6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800">
          {pillars.map((pillar) => (
            <>
              {/* Pillar Row */}
              <tr key={pillar.id} className="border-t border-gray-200">
                <td className="p-2">
                  <span className="text-xs font-semibold text-blue-700">Pillar</span>{" "}
                  <span
                    className={
                      dirty ? "text-xs text-red-600" : "text-xs text-gray-500"
                    }
                  >
                    {pillar.ref_code}
                  </span>
                </td>
                <td className="p-2 font-medium">{pillar.name}</td>
                <td className="p-2 text-gray-600">{pillar.description}</td>
                <td className="p-2 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleMovePillar(pillar.id, "up")}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleMovePillar(pillar.id, "down")}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemovePillar(pillar.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddTheme(pillar.id)}>
                    <Plus className="h-4 w-4 mr-1" /> Theme
                  </Button>
                </td>
              </tr>

              {/* Theme Rows */}
              {pillar.themes.map((theme) => (
                <>
                  <tr key={theme.id} className="border-t border-gray-100 bg-gray-50">
                    <td className="p-2 pl-6">
                      <span className="text-xs font-semibold text-green-700">Theme</span>{" "}
                      <span
                        className={
                          dirty ? "text-xs text-red-600" : "text-xs text-gray-500"
                        }
                      >
                        {theme.ref_code}
                      </span>
                    </td>
                    <td className="p-2 font-medium">{theme.name}</td>
                    <td className="p-2 text-gray-600">{theme.description}</td>
                    <td className="p-2 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMoveTheme(pillar.id, theme.id, "up")}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleMoveTheme(pillar.id, theme.id, "down")}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveTheme(pillar.id, theme.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddSubtheme(pillar.id, theme.id)}>
                        <Plus className="h-4 w-4 mr-1" /> Subtheme
                      </Button>
                    </td>
                  </tr>

                  {/* Subtheme Rows */}
                  {theme.subthemes.map((sub) => (
                    <tr key={sub.id} className="border-t border-gray-100">
                      <td className="p-2 pl-12">
                        <span className="text-xs font-semibold text-purple-700">
                          Subtheme
                        </span>{" "}
                        <span
                          className={
                            dirty ? "text-xs text-red-600" : "text-xs text-gray-500"
                          }
                        >
                          {sub.ref_code}
                        </span>
                      </td>
                      <td className="p-2 font-medium">{sub.name}</td>
                      <td className="p-2 text-gray-600">{sub.description}</td>
                      <td className="p-2 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSubtheme(pillar.id, theme.id, sub.id, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSubtheme(pillar.id, theme.id, sub.id, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSubtheme(pillar.id, theme.id, sub.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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

      <div className="pt-4">
        <Button onClick={handleAddPillar}>
          <Plus className="h-4 w-4 mr-1" /> Add Pillar
        </Button>
      </div>
    </div>
  );
}
