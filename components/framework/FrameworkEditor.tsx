"use client";

import { useState } from "react";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import {
  addPillarLocal,
  addThemeLocal,
  addSubthemeLocal,
  removePillarLocal,
  removeThemeLocal,
  removeSubthemeLocal,
  movePillarLocal,
  moveThemeLocal,
  moveSubthemeLocal,
  saveFramework,
} from "@/lib/framework-actions";
import { buildRefCodeMap } from "@/lib/framework-utils";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";

type FrameworkEditorProps = {
  initialData: NestedPillar[];
};

export default function FrameworkEditor({ initialData }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialData);
  const [dirty, setDirty] = useState(false);

  const refMap = buildRefCodeMap(pillars);

  function markDirty(updated: NestedPillar[]) {
    setPillars(updated);
    setDirty(true);
  }

  // Handlers
  const handleAddPillar = () => markDirty(addPillarLocal(pillars));
  const handleAddTheme = (pillarId: string) => markDirty(addThemeLocal(pillars, pillarId));
  const handleAddSubtheme = (pillarId: string, themeId: string) => markDirty(addSubthemeLocal(pillars, pillarId, themeId));

  const handleRemovePillar = (pillarId: string) => markDirty(removePillarLocal(pillars, pillarId));
  const handleRemoveTheme = (pillarId: string, themeId: string) => markDirty(removeThemeLocal(pillars, pillarId, themeId));
  const handleRemoveSubtheme = (pillarId: string, themeId: string, subthemeId: string) =>
    markDirty(removeSubthemeLocal(pillars, pillarId, themeId, subthemeId));

  const handleMovePillar = (pillarId: string, dir: "up" | "down") => markDirty(movePillarLocal(pillars, pillarId, dir));
  const handleMoveTheme = (pillarId: string, themeId: string, dir: "up" | "down") => markDirty(moveThemeLocal(pillars, pillarId, themeId, dir));
  const handleMoveSubtheme = (pillarId: string, themeId: string, subthemeId: string, dir: "up" | "down") =>
    markDirty(moveSubthemeLocal(pillars, pillarId, themeId, subthemeId, dir));

  const handleSave = async () => {
    await saveFramework(pillars);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          Items marked in <span className="text-red-500 font-semibold">red</span> will be renumbered when saved.
          <div className="mt-2">
            <Button onClick={handleSave}>Save Framework</Button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-gray-600">
            <th className="py-2 px-2">Type</th>
            <th className="py-2 px-2">Name / Description</th>
            <th className="py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <>
              <tr key={pillar.id} className="border-b">
                <td className="py-2 px-2">
                  <span className="text-xs font-medium text-gray-500">Pillar</span>
                  <div className={refMap[pillar.id].dirty ? "text-red-500 text-xs" : "text-gray-400 text-xs"}>
                    {refMap[pillar.id].code}
                  </div>
                </td>
                <td className="py-2 px-2">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-gray-500">{pillar.description}</div>
                </td>
                <td className="py-2 px-2 space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => handleMovePillar(pillar.id, "up")}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleMovePillar(pillar.id, "down")}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleAddTheme(pillar.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleRemovePillar(pillar.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
              {pillar.themes.map((theme) => (
                <>
                  <tr key={theme.id} className="border-b bg-gray-50">
                    <td className="py-2 px-2 pl-6">
                      <span className="text-xs font-medium text-gray-500">Theme</span>
                      <div className={refMap[theme.id].dirty ? "text-red-500 text-xs" : "text-gray-400 text-xs"}>
                        {refMap[theme.id].code}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-sm text-gray-500">{theme.description}</div>
                    </td>
                    <td className="py-2 px-2 space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleMoveTheme(pillar.id, theme.id, "up")}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleMoveTheme(pillar.id, theme.id, "down")}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleAddSubtheme(pillar.id, theme.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleRemoveTheme(pillar.id, theme.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  {theme.subthemes.map((sub) => (
                    <tr key={sub.id} className="border-b bg-gray-100">
                      <td className="py-2 px-2 pl-12">
                        <span className="text-xs font-medium text-gray-500">Subtheme</span>
                        <div className={refMap[sub.id].dirty ? "text-red-500 text-xs" : "text-gray-400 text-xs"}>
                          {refMap[sub.id].code}
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-sm text-gray-500">{sub.description}</div>
                      </td>
                      <td className="py-2 px-2 space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => handleMoveSubtheme(pillar.id, theme.id, sub.id, "up")}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleMoveSubtheme(pillar.id, theme.id, sub.id, "down")}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleRemoveSubtheme(pillar.id, theme.id, sub.id)}>
                          <Trash2 className="h-4 w-4" />
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

      <div>
        <Button onClick={handleAddPillar}>Add Pillar</Button>
      </div>
    </div>
  );
}
