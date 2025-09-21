// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import type { NestedPillar, NestedTheme, Subtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({ name, description: "", sort_order: pillars.length + 1 });
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
    const parent = pillars.flatMap((p) => p.themes).find((t) => t.id === themeId);
    const count = parent?.subthemes.length ?? 0;

    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const all: Record<string, boolean> = {};
              pillars.forEach((p) => {
                all[p.id] = true;
                p.themes.forEach((t) => {
                  all[t.id] = true;
                  t.subthemes.forEach((s) => (all[s.id] = true));
                });
              });
              setExpanded(all);
            }}
          >
            Expand All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded({})}
          >
            Collapse All
          </Button>
        </div>
        <div className="flex space-x-2">
          {editMode && (
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-600"
              onClick={handleAddPillar}
            >
              + Add Pillar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-[#b7410e] border-[#b7410e]"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 rounded-md text-sm">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <th className="w-[25%] px-3 py-2 text-left">Type / Ref Code</th>
            <th className="w-[50%] px-3 py-2 text-left">Name / Description</th>
            <th className="w-[10%] px-3 py-2 text-center">Sort</th>
            <th className="w-[15%] px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar, i) => {
            const pillarRef = `P${pillar.sort_order ?? i + 1}`;
            return (
              <>
                <tr key={pillar.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="text-gray-500"
                      >
                        {expanded[pillar.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge className="bg-blue-100 text-blue-600">Pillar</Badge>
                      <span className="text-gray-500">{pillarRef}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{pillar.name}</div>
                    <div className="text-gray-500 text-xs">{pillar.description}</div>
                  </td>
                  <td className="px-3 py-2 text-center">{pillar.sort_order}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {editMode && (
                      <>
                        <button
                          onClick={() => handleAddTheme(pillar.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete pillar "${pillar.name}"?`)) {
                              deletePillar(pillar.id).then(() =>
                                window.location.reload()
                              );
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>

                {expanded[pillar.id] &&
                  pillar.themes.map((theme, j) => {
                    const themeRef = `${pillarRef}.${theme.sort_order ?? j + 1}`;
                    return (
                      <>
                        <tr key={theme.id} className="border-t bg-gray-50">
                          <td className="px-6 py-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleExpand(theme.id)}
                                className="text-gray-500"
                              >
                                {expanded[theme.id] ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )}
                              </button>
                              <Badge className="bg-green-100 text-green-600">Theme</Badge>
                              <span className="text-gray-500">{themeRef}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-semibold">{theme.name}</div>
                            <div className="text-gray-500 text-xs">{theme.description}</div>
                          </td>
                          <td className="px-3 py-2 text-center">{theme.sort_order}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            {editMode && (
                              <>
                                <button
                                  onClick={() => handleAddSubtheme(theme.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Plus size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete theme "${theme.name}"?`)) {
                                      deleteTheme(theme.id).then(() =>
                                        window.location.reload()
                                      );
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>

                        {expanded[theme.id] &&
                          theme.subthemes.map((s, k) => {
                            const subRef = `${themeRef}.${s.sort_order ?? k + 1}`;
                            return (
                              <tr key={s.id} className="border-t">
                                <td className="px-10 py-2">
                                  <Badge className="bg-red-100 text-red-600">Sub</Badge>
                                  <span className="ml-2 text-gray-500">{subRef}</span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-semibold">{s.name}</div>
                                  <div className="text-gray-500 text-xs">{s.description}</div>
                                </td>
                                <td className="px-3 py-2 text-center">{s.sort_order}</td>
                                <td className="px-3 py-2 text-right space-x-2">
                                  {editMode && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete subtheme "${s.name}"?`)) {
                                          deleteSubtheme(s.id).then(() =>
                                            window.location.reload()
                                          );
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </>
                    );
                  })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
