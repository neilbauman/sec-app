// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { NormalizedPillar } from "@/lib/refCodes";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // expand/collapse helpers
  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function expandAll() {
    const all: Record<string, boolean> = {};
    pillars.forEach((p) => {
      all[p.id] = true;
      p.themes.forEach((t) => {
        all[t.id] = true;
        t.subthemes.forEach((s) => (all[s.id] = true));
      });
    });
    setExpanded(all);
  }
  function collapseAll() {
    setExpanded({});
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="px-2 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100"
          >
            Collapse All
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {editMode && (
            <button
              onClick={() => alert("Add Pillar (hook up later)")}
              className="px-3 py-1 text-sm border rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              + Add Pillar
            </button>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1 text-sm border rounded bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[20%] px-3 py-2 text-left text-sm font-medium text-gray-700">
                Type / Ref Code
              </th>
              <th className="w-[55%] px-3 py-2 text-left text-sm font-medium text-gray-700">
                Name / Description
              </th>
              <th className="w-[10%] px-3 py-2 text-center text-sm font-medium text-gray-700">
                Sort Order
              </th>
              <th className="w-[15%] px-3 py-2 text-right text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => {
              const pillarOpen = expanded[pillar.id];
              return (
                <>
                  {/* Pillar Row */}
                  <tr key={pillar.id} className="border-t">
                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleExpand(pillar.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {pillarOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          Pillar
                        </span>
                        <span className="text-xs text-gray-500">
                          {pillar.ref_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-gray-500">
                        {pillar.description}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center text-sm text-gray-600">
                      {pillar.sort_order}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {editMode && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => alert("Add Theme")}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert("Delete Pillar")}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Themes */}
                  {pillarOpen &&
                    pillar.themes.map((theme) => {
                      const themeOpen = expanded[theme.id];
                      return (
                        <>
                          <tr key={theme.id} className="border-t">
                            <td className="px-3 py-2 align-top pl-8">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => toggleExpand(theme.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {themeOpen ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                                  Theme
                                </span>
                                <span className="text-xs text-gray-500">
                                  {theme.ref_code}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium">{theme.name}</div>
                              <div className="text-xs text-gray-500">
                                {theme.description}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-gray-600">
                              {theme.sort_order}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {editMode && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => alert("Add Subtheme")}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => alert("Delete Theme")}
                                    className="p-1 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>

                          {/* Subthemes */}
                          {themeOpen &&
                            theme.subthemes.map((s) => (
                              <tr key={s.id} className="border-t">
                                <td className="px-3 py-2 align-top pl-14">
                                  <div className="flex items-center space-x-1">
                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                                      Subtheme
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {s.ref_code}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-medium">{s.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {s.description}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center text-sm text-gray-600">
                                  {s.sort_order}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {editMode && (
                                    <div className="flex items-center justify-end space-x-2">
                                      <button
                                        onClick={() => alert("Delete Subtheme")}
                                        className="p-1 text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </>
                      );
                    })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
