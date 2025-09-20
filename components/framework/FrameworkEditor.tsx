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
import type { Pillar, NestedTheme, Subtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: Pillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<Pillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    pillars.forEach((p) => {
      all[p.id] = true;
      p.themes?.forEach((t: NestedTheme) => {
        all[t.id] = true;
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({});

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
      p.themes?.forEach((t) => {
        if (t.id === themeId) count = t.subthemes?.length ?? 0;
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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="w-[25%] text-left px-3 py-2">Type / Ref Code</th>
              <th className="w-[50%] text-left px-3 py-2">
                Name / Description
              </th>
              <th className="w-[10%] text-center px-3 py-2">Sort Order</th>
              <th className="w-[15%] text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <tr key={pillar.id} className="border-t">
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleExpand(pillar.id)}
                      className="text-gray-500"
                    >
                      {expanded[pillar.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 font-medium">
                      Pillar
                    </span>
                    <span className="text-gray-500 text-xs">
                      {pillar.ref_code}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="font-semibold">{pillar.name}</div>
                  <div className="text-gray-500 text-xs">
                    {pillar.description}
                  </div>
                </td>
                <td className="px-3 py-2 text-center align-top">
                  {pillar.sort_order}
                </td>
                <td className="px-3 py-2 text-right align-top space-x-2">
                  {editMode && (
                    <>
                      <button
                        onClick={() => handleAddTheme(pillar.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Delete pillar "${pillar.name}" and all its children?`
                            )
                          ) {
                            deletePillar(pillar.id).then(() =>
                              window.location.reload()
                            );
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
