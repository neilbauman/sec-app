// components/framework/FrameworkEditor.tsx
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
  saveFramework,
} from "@/lib/framework-actions";
import { recalcRefCodes, buildRefCodeMap, RefMeta, cloneFramework } from "@/lib/framework-utils";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(recalcRefCodes(initialPillars));
  const [saved, setSaved] = useState<NestedPillar[]>(cloneFramework(initialPillars));

  const refMap: Record<string, RefMeta> = buildRefCodeMap(saved, pillars);

  const commit = (next: NestedPillar[]) => setPillars(recalcRefCodes(next));

  return (
    <div className="space-y-4">
      {/* Banner only if changes exist */}
      {JSON.stringify(saved) !== JSON.stringify(pillars) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded">
          Items in <span className="text-red-500 font-semibold">red</span> have ref codes
          that will be regenerated on save.
          <button
            onClick={() => {
              saveFramework(pillars).then((persisted) => {
                setSaved(cloneFramework(persisted));
                setPillars(recalcRefCodes(persisted));
              });
            }}
            className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pillars.map((pillar) => (
            <>
              <tr key={pillar.id}>
                <td className="px-3 py-2">
                  <span className="text-xs font-medium text-gray-500">Pillar</span>
                  <div
                    className={
                      refMap[pillar.id]?.dirty
                        ? "text-red-500 text-xs"
                        : "text-gray-400 text-xs"
                    }
                  >
                    {refMap[pillar.id]?.code}
                  </div>
                </td>
                <td className="px-3 py-2">{pillar.name}</td>
                <td className="px-3 py-2">{pillar.description}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => commit(addTheme(pillars, pillar.id))}
                  >
                    + Theme
                  </button>
                  <button
                    className="text-gray-500"
                    onClick={() => commit(movePillar(pillars, pillar.id, "up"))}
                  >
                    ↑
                  </button>
                  <button
                    className="text-gray-500"
                    onClick={() => commit(movePillar(pillars, pillar.id, "down"))}
                  >
                    ↓
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => commit(removePillar(pillars, pillar.id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {pillar.themes.map((theme) => (
                <>
                  <tr key={theme.id} className="bg-gray-50">
                    <td className="px-6 py-2">
                      <span className="text-xs font-medium text-green-600">Theme</span>
                      <div
                        className={
                          refMap[theme.id]?.dirty
                            ? "text-red-500 text-xs"
                            : "text-gray-400 text-xs"
                        }
                      >
                        {refMap[theme.id]?.code}
                      </div>
                    </td>
                    <td className="px-3 py-2">{theme.name}</td>
                    <td className="px-3 py-2">{theme.description}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => commit(addSubtheme(pillars, pillar.id, theme.id))}
                      >
                        + Subtheme
                      </button>
                      <button
                        className="text-gray-500"
                        onClick={() => commit(moveTheme(pillars, pillar.id, theme.id, "up"))}
                      >
                        ↑
                      </button>
                      <button
                        className="text-gray-500"
                        onClick={() => commit(moveTheme(pillars, pillar.id, theme.id, "down"))}
                      >
                        ↓
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => commit(removeTheme(pillars, pillar.id, theme.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {theme.subthemes.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-9 py-2">
                        <span className="text-xs font-medium text-red-500">Subtheme</span>
                        <div
                          className={
                            refMap[sub.id]?.dirty
                              ? "text-red-500 text-xs"
                              : "text-gray-400 text-xs"
                          }
                        >
                          {refMap[sub.id]?.code}
                        </div>
                      </td>
                      <td className="px-3 py-2">{sub.name}</td>
                      <td className="px-3 py-2">{sub.description}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          className="text-gray-500"
                          onClick={() =>
                            commit(moveSubtheme(pillars, pillar.id, theme.id, sub.id, "up"))
                          }
                        >
                          ↑
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() =>
                            commit(moveSubtheme(pillars, pillar.id, theme.id, sub.id, "down"))
                          }
                        >
                          ↓
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() =>
                            commit(removeSubtheme(pillars, pillar.id, theme.id, sub.id))
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </>
          ))}
        </tbody>
      </table>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => commit(addPillar(pillars))}
      >
        + Add Pillar
      </button>
    </div>
  );
}
