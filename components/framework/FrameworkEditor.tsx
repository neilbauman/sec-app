// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
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
import { cloneFramework, buildRefCodeMap } from "@/lib/framework-utils";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(cloneFramework(initialPillars));
  const [dirty, setDirty] = useState(false);

  // Build ref code map so we can highlight changes
  const refCodeMap = buildRefCodeMap(initialPillars);

  const markDirty = (updated: NestedPillar[]) => {
    setPillars(updated);
    setDirty(true);
  };

  const handleSave = async () => {
    const saved = await saveFramework(pillars);
    setPillars(saved);
    setDirty(false);
  };

  const isChangedRef = (id: string, refCode: string) => {
    return refCodeMap[id] && refCodeMap[id] !== refCode;
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-2 rounded-lg">
          <strong>Pending changes:</strong> Items marked in <span className="text-red-600">red</span> will
          have their ref codes updated on save.
          <button
            onClick={handleSave}
            className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      )}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="px-2 py-2 w-1/4">Name</th>
            <th className="px-2 py-2">Description</th>
            <th className="px-2 py-2 w-1/6">Type & Ref</th>
            <th className="px-2 py-2 w-1/6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar, pi) => (
            <Fragment key={pillar.id}>
              {/* Pillar Row */}
              <tr className="border-b align-top">
                <td className="px-2 py-2 font-medium">
                  {pillar.name}
                  {pillar.description && (
                    <div className="text-xs text-gray-500">{pillar.description}</div>
                  )}
                </td>
                <td className="px-2 py-2" />
                <td className="px-2 py-2">
                  <span className="text-xs font-semibold text-indigo-600 mr-2">Pillar</span>
                  <span
                    className={`text-xs ${
                      isChangedRef(pillar.id, pillar.ref_code) ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {pillar.ref_code}
                  </span>
                </td>
                <td className="px-2 py-2 text-right space-x-2">
                  <button onClick={() => markDirty(addTheme(pillars, pillar.id))} className="text-xs text-green-600 hover:underline">
                    + Theme
                  </button>
                  <button onClick={() => markDirty(movePillar(pillars, pillar.id, "up"))} className="text-xs text-gray-600 hover:underline">
                    ↑
                  </button>
                  <button onClick={() => markDirty(movePillar(pillars, pillar.id, "down"))} className="text-xs text-gray-600 hover:underline">
                    ↓
                  </button>
                  <button onClick={() => markDirty(removePillar(pillars, pillar.id))} className="text-xs text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>

              {/* Theme Rows */}
              {pillar.themes.map((theme) => (
                <Fragment key={theme.id}>
                  <tr className="border-b align-top bg-gray-50">
                    <td className="px-6 py-2">
                      {theme.name}
                      {theme.description && (
                        <div className="text-xs text-gray-500">{theme.description}</div>
                      )}
                    </td>
                    <td className="px-2 py-2" />
                    <td className="px-2 py-2">
                      <span className="text-xs font-semibold text-indigo-500 mr-2">Theme</span>
                      <span
                        className={`text-xs ${
                          isChangedRef(theme.id, theme.ref_code) ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {theme.ref_code}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right space-x-2">
                      <button
                        onClick={() => markDirty(addSubtheme(pillars, pillar.id, theme.id))}
                        className="text-xs text-green-600 hover:underline"
                      >
                        + Subtheme
                      </button>
                      <button
                        onClick={() => markDirty(moveTheme(pillars, pillar.id, theme.id, "up"))}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => markDirty(moveTheme(pillars, pillar.id, theme.id, "down"))}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => markDirty(removeTheme(pillars, pillar.id, theme.id))}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Subtheme Rows */}
                  {theme.subthemes.map((sub) => (
                    <tr key={sub.id} className="border-b align-top">
                      <td className="px-10 py-2">
                        {sub.name}
                        {sub.description && (
                          <div className="text-xs text-gray-500">{sub.description}</div>
                        )}
                      </td>
                      <td className="px-2 py-2" />
                      <td className="px-2 py-2">
                        <span className="text-xs font-semibold text-indigo-400 mr-2">Subtheme</span>
                        <span
                          className={`text-xs ${
                            isChangedRef(sub.id, sub.ref_code) ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {sub.ref_code}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right space-x-2">
                        <button
                          onClick={() => markDirty(moveSubtheme(pillars, pillar.id, theme.id, sub.id, "up"))}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => markDirty(moveSubtheme(pillars, pillar.id, theme.id, sub.id, "down"))}
                          className="text-xs text-gray-600 hover:underline"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => markDirty(removeSubtheme(pillars, pillar.id, theme.id, sub.id))}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
