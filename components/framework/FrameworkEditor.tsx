// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Upload,
  Download,
} from "lucide-react";
import type {
  NestedPillar,
  NestedTheme,
  Subtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const all: Record<string, boolean> = {};
    pillars.forEach((p) => {
      all[p.id] = true;
      p.themes.forEach((t) => {
        all[t.id] = true;
      });
    });
    setExpanded(all);
  }

  function collapseAll() {
    setExpanded({});
  }

  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({
      name,
      description: "",
      sort_order: pillars.length + 1,
    });
    window.location.reload();
  }

  async function handleAddTheme(pillarId: string) {
    const name = prompt("Enter theme name:");
    if (!name) return;

    const pillar = pillars.find((p) => p.id === pillarId);
    const count = pillar?.themes?.length ?? 0;

    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  async function handleAddSubtheme(themeId: string) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;

    let count = 0;
    pillars.forEach((p) => {
      p.themes.forEach((t) => {
        if (t.id === themeId) count = t.subthemes.length;
      });
    });

    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  return (
    <div className="p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
          >
            <ChevronsDown className="w-4 h-4" />
            <span>Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
          >
            <ChevronsUp className="w-4 h-4" />
            <span>Collapse All</span>
          </button>
        </div>
        <div className="flex space-x-2">
          {editMode && (
            <>
              <button
                onClick={handleAddPillar}
                className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pillar</span>
              </button>
              <button className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-600 hover:bg-gray-50">
                <Upload className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-[#b7410e] hover:bg-orange-50"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm font-medium text-gray-700">
            <tr>
              <th className="w-[25%] px-4 py-2">Type / Ref Code</th>
              <th className="w-[50%] px-4 py-2">Name / Description</th>
              <th className="w-[10%] px-4 py-2 text-center">Sort Order</th>
              <th className="w-[15%] px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {pillars.map((pillar) => (
              <>
                {/* Pillar row */}
                <tr key={pillar.id} className="border-t">
                  <td className="px-4 py-2 align-top">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expanded[pillar.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                        Pillar
                      </span>
                      <span className="text-xs text-gray-500">{pillar.ref_code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top">
                    <div className="font-semibold">{pillar.name}</div>
                    <div className="text-gray-500 text-xs">{pillar.description}</div>
                  </td>
                  <td className="px-4 py-2 align-top text-center">{pillar.sort_order}</td>
                  <td className="px-4 py-2 align-top text-right space-x-2">
                    {editMode && (
                      <>
                        <button
                          onClick={() => handleAddTheme(pillar.id)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete pillar "${pillar.name}"?`)) {
                              deletePillar(pillar.id).then(() =>
                                window.location.reload()
                              );
                            }
                          }}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>

                {/* Themes under pillar */}
                {expanded[pillar.id] &&
                  pillar.themes.map((theme: NestedTheme) => (
                    <tr key={theme.id} className="border-t bg-gray-50">
                      <td className="px-8 py-2 align-top">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleExpand(theme.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expanded[theme.id] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
                            Theme
                          </span>
                          <span className="text-xs text-gray-500">{theme.ref_code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="font-semibold">{theme.name}</div>
                        <div className="text-gray-500 text-xs">{theme.description}</div>
                      </td>
                      <td className="px-4 py-2 align-top text-center">{theme.sort_order}</td>
                      <td className="px-4 py-2 align-top text-right space-x-2">
                        {editMode && (
                          <>
                            <button
                              onClick={() => handleAddSubtheme(theme.id)}
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete theme "${theme.name}"?`)) {
                                  deleteTheme(theme.id).then(() =>
                                    window.location.reload()
                                  );
                                }
                              }}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}

                {/* Subthemes under each theme */}
                {pillar.themes.map(
                  (theme) =>
                    expanded[theme.id] &&
                    theme.subthemes.map((s: Subtheme) => (
                      <tr key={s.id} className="border-t">
                        <td className="px-12 py-2 align-top">
                          <div className="flex items-center space-x-1">
                            <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium">
                              Subtheme
                            </span>
                            <span className="text-xs text-gray-500">{s.ref_code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="font-semibold">{s.name}</div>
                          <div className="text-gray-500 text-xs">{s.description}</div>
                        </td>
                        <td className="px-4 py-2 align-top text-center">{s.sort_order}</td>
                        <td className="px-4 py-2 align-top text-right">
                          {editMode && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete subtheme "${s.name}"?`)) {
                                  deleteSubtheme(s.id).then(() =>
                                    window.location.reload()
                                  );
                                }
                              }}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
