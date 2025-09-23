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

  return (
    <div className="space-y-4">
      {pendingChanges && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          <strong>Note:</strong> Items shown in{" "}
          <span className="text-red-600 font-medium">red</span> will have their
          reference codes regenerated once you save.
        </div>
      )}

      <div className="overflow-hidden border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/3 px-3 py-2 text-left font-medium text-gray-700">
                Type / Ref
              </th>
              <th className="w-1/3 px-3 py-2 text-left font-medium text-gray-700">
                Name & Description
              </th>
              <th className="w-1/3 px-3 py-2 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((p, pIdx) => (
              <>
                {/* Pillar */}
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 align-top">
                    <span className="text-xs font-semibold text-blue-600">
                      Pillar
                    </span>
                    <div
                      className={`text-xs ${
                        pendingChanges ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {p.ref_code || `(unsaved ${pIdx + 1})`}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      defaultValue={p.name}
                      onBlur={(e) =>
                        handleUpdateRow(
                          { id: p.id, type: "pillar" },
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full border-none bg-transparent p-0 font-medium focus:ring-0"
                    />
                    <textarea
                      defaultValue={p.description || ""}
                      onBlur={(e) =>
                        handleUpdateRow(
                          { id: p.id, type: "pillar" },
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full border-none bg-transparent p-0 text-gray-600 text-sm focus:ring-0"
                    />
                  </td>
                  <td className="px-3 py-2 align-top flex space-x-2">
                    <button
                      onClick={() => handleMovePillar(p.id, "up")}
                      disabled={loading !== null}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMovePillar(p.id, "down")}
                      disabled={loading !== null}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemovePillar(p.id)}
                      disabled={loading !== null}
                      className="text-gray-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                    <button
                      onClick={() => handleAddTheme(p.id)}
                      disabled={loading !== null}
                      className="ml-auto text-gray-500 hover:text-green-600"
                    >
                      + Theme
                    </button>
                  </td>
                </tr>

                {/* Themes */}
                {p.themes.map((t, tIdx) => (
                  <>
                    <tr key={t.id} className="border-t bg-gray-50">
                      <td className="px-6 py-2 align-top">
                        <span className="text-xs font-semibold text-purple-600">
                          Theme
                        </span>
                        <div
                          className={`text-xs ${
                            pendingChanges ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {t.ref_code || `(unsaved ${tIdx + 1})`}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          type="text"
                          defaultValue={t.name}
                          onBlur={(e) =>
                            handleUpdateRow(
                              { id: t.id, type: "theme" },
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full border-none bg-transparent p-0 font-medium focus:ring-0"
                        />
                        <textarea
                          defaultValue={t.description || ""}
                          onBlur={(e) =>
                            handleUpdateRow(
                              { id: t.id, type: "theme" },
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full border-none bg-transparent p-0 text-gray-600 text-sm focus:ring-0"
                        />
                      </td>
                      <td className="px-3 py-2 align-top flex space-x-2">
                        <button
                          onClick={() => handleMoveTheme(p.id, t.id, "up")}
                          disabled={loading !== null}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveTheme(p.id, t.id, "down")}
                          disabled={loading !== null}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveTheme(p.id, t.id)}
                          disabled={loading !== null}
                          className="text-gray-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => handleAddSubtheme(t.id)}
                          disabled={loading !== null}
                          className="ml-auto text-gray-500 hover:text-green-600"
                        >
                          + Sub
                        </button>
                      </td>
                    </tr>

                    {/* Subthemes */}
                    {t.subthemes.map((s, sIdx) => (
                      <tr key={s.id} className="border-t">
                        <td className="px-10 py-2 align-top">
                          <span className="text-xs font-semibold text-teal-600">
                            Subtheme
                          </span>
                          <div
                            className={`text-xs ${
                              pendingChanges ? "text-red-600" : "text-gray-500"
                            }`}
                          >
                            {s.ref_code || `(unsaved ${sIdx + 1})`}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <input
                            type="text"
                            defaultValue={s.name}
                            onBlur={(e) =>
                              handleUpdateRow(
                                { id: s.id, type: "subtheme" },
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full border-none bg-transparent p-0 font-medium focus:ring-0"
                          />
                          <textarea
                            defaultValue={s.description || ""}
                            onBlur={(e) =>
                              handleUpdateRow(
                                { id: s.id, type: "subtheme" },
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border-none bg-transparent p-0 text-gray-600 text-sm focus:ring-0"
                          />
                        </td>
                        <td className="px-3 py-2 align-top flex space-x-2">
                          <button
                            onClick={() => handleMoveSubtheme(t.id, s.id, "up")}
                            disabled={loading !== null}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() =>
                              handleMoveSubtheme(t.id, s.id, "down")
                            }
                            disabled={loading !== null}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleRemoveSubtheme(t.id, s.id)}
                            disabled={loading !== null}
                            className="text-gray-500 hover:text-red-600"
                          >
                            ✕
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
      </div>

      <div>
        <button
          onClick={handleAddPillar}
          disabled={loading !== null}
          className="px-3 py-1 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
        >
          + Add Pillar
        </button>
      </div>
    </div>
  );
}
