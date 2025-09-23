"use client";

import { useState } from "react";
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
} from "@/lib/framework-actions";
import {
  recalcRefCodes,
  markDirty,
  RefCodeMap,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialPillars);
  const [savedRefMap, setSavedRefMap] = useState<RefCodeMap>(
    recalcRefCodes(initialPillars)
  );
  const [draftRefMap, setDraftRefMap] = useState<RefCodeMap>(savedRefMap);
  const [dirty, setDirty] = useState(false);

  // Update state and recalc draft ref codes
  const update = (next: NestedPillar[]) => {
    const newMap = recalcRefCodes(next);
    setPillars(next);
    setDraftRefMap(markDirty(savedRefMap, newMap));
    setDirty(true);
  };

  const handleSave = () => {
    setSavedRefMap(recalcRefCodes(pillars));
    setDraftRefMap(recalcRefCodes(pillars));
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-3 py-2 rounded-md">
          Items marked in red will have new reference codes after save.
          <button
            onClick={handleSave}
            className="ml-4 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-2 py-2">Type / Ref</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Description</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <>
              <tr key={pillar.id} className="border-t">
                <td className="px-2 py-2">
                  <div className="text-xs text-gray-500">Pillar</div>
                  <div
                    className={
                      draftRefMap[pillar.id]?.dirty
                        ? "text-red-500 text-xs"
                        : "text-gray-400 text-xs"
                    }
                  >
                    {draftRefMap[pillar.id]?.code}
                  </div>
                </td>
                <td className="px-2 py-2">{pillar.name}</td>
                <td className="px-2 py-2">{pillar.description}</td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    onClick={() => update(addTheme(pillars, pillar.id))}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    +Theme
                  </button>
                  <button
                    onClick={() => update(removePillar(pillars, pillar.id))}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {pillar.themes.map((theme) => (
                <tr key={theme.id} className="border-t bg-gray-50">
                  <td className="px-2 py-2 pl-6">
                    <div className="text-xs text-gray-500">Theme</div>
                    <div
                      className={
                        draftRefMap[theme.id]?.dirty
                          ? "text-red-500 text-xs"
                          : "text-gray-400 text-xs"
                      }
                    >
                      {draftRefMap[theme.id]?.code}
                    </div>
                  </td>
                  <td className="px-2 py-2">{theme.name}</td>
                  <td className="px-2 py-2">{theme.description}</td>
                  <td className="px-2 py-2 space-x-1">
                    <button
                      onClick={() =>
                        update(addSubtheme(pillars, pillar.id, theme.id))
                      }
                      className="text-blue-600 hover:underline text-xs"
                    >
                      +Subtheme
                    </button>
                    <button
                      onClick={() =>
                        update(removeTheme(pillars, pillar.id, theme.id))
                      }
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => update(addPillar(pillars))}
          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Pillar
        </button>
      </div>
    </div>
  );
}
