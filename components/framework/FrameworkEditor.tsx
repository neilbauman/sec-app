"use client";

import { useState, useEffect } from "react";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
  saveFramework,
} from "@/lib/framework-actions";
import { cloneFramework, buildRefCodeMap, RefMeta } from "@/lib/framework-utils";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialPillars);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [refMap, setRefMap] = useState<Record<string, RefMeta>>({});

  useEffect(() => {
    setRefMap(buildRefCodeMap(pillars, dirtyIds));
  }, [pillars, dirtyIds]);

  const markDirty = (id: string) => setDirtyIds((prev) => new Set([...prev, id]));

  const handleSave = async () => {
    const updated = await saveFramework(pillars);
    setPillars(updated);
    setDirtyIds(new Set());
  };

  return (
    <div className="space-y-2">
      {dirtyIds.size > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-md text-sm mb-2">
          Items in <span className="text-red-500 font-semibold">red</span> will be regenerated on save.
          <button
            onClick={handleSave}
            className="ml-3 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-2">Type</th>
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-left py-2 px-2">Description</th>
            <th className="text-left py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <tr key={pillar.id} className="border-b">
              <td className="py-2 px-2">
                <span className="text-xs font-medium text-gray-500">Pillar</span>
                <div
                  className={
                    refMap[pillar.id]?.dirty ? "text-red-500 text-xs" : "text-gray-400 text-xs"
                  }
                >
                  {refMap[pillar.id]?.code}
                </div>
              </td>
              <td className="py-2 px-2">{pillar.name}</td>
              <td className="py-2 px-2">{pillar.description}</td>
              <td className="py-2 px-2">
                <button
                  onClick={() => {
                    markDirty(pillar.id);
                    removePillar(pillars, pillar.id).then(setPillars);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
