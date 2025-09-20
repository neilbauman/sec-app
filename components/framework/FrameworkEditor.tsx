"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
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
import { ChevronRight, ChevronDown, Plus, Trash2, Upload, Download } from "lucide-react";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // Toggle expand/collapse
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

  // Handlers
  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;

    const newPillar: NestedPillar = {
      id: crypto.randomUUID(),
      name,
      description: "",
      sort_order: pillars.length + 1,
      ref_code: `P${pillars.length + 1}`,
      themes: [],
    };

    await addPillar({
      name,
      description: "",
      sort_order: newPillar.sort_order,
    });

    setPillars([...pillars, newPillar]);
  }

  async function handleAddTheme(pillarId: string) {
    const name = prompt("Enter theme name:");
    if (!name) return;

    const pillar = pillars.find((p) => p.id === pillarId);
    const count = pillar?.themes?.length ?? 0;

    // ⚡ Temporary patch: add pillar_code to satisfy NestedTheme
    const newTheme: NestedTheme = {
      id: crypto.randomUUID(),
      pillar_id: pillarId,
      pillar_code: pillar?.ref_code ?? "", // temporary patch
      name,
      description: "",
      sort_order: count + 1,
      ref_code: `T${pillar?.sort_order ?? 1}.${count + 1}`,
      subthemes: [],
    };

    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: newTheme.sort_order,
    });

    setPillars(
      pillars.map((p) =>
        p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
      )
    );
  }

  async function handleAddSubtheme(themeId: string) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;

    let parentPillar: NestedPillar | undefined;
    let parentTheme: NestedTheme | undefined;
    for (const p of pillars) {
      const t = p.themes.find((t) => t.id === themeId);
      if (t) {
        parentPillar = p;
        parentTheme = t;
        break;
      }
    }
    if (!parentPillar || !parentTheme) return;

    const count = parentTheme.subthemes.length;

    const newSub: Subtheme = {
      id: crypto.randomUUID(),
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
      ref_code: `ST${parentPillar.sort_order}.${parentTheme.sort_order}.${count + 1}`,
    };

    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: newSub.sort_order,
    });

    setPillars(
      pillars.map((p) =>
        p.id === parentPillar!.id
          ? {
              ...p,
              themes: p.themes.map((t) =>
                t.id === themeId
                  ? { ...t, subthemes: [...t.subthemes, newSub] }
                  : t
              ),
            }
          : p
      )
    );
  }

  async function handleDeletePillar(id: string) {
    if (!confirm("Delete this pillar and all its themes?")) return;
    await deletePillar(id);
    setPillars(pillars.filter((p) => p.id !== id));
  }

  async function handleDeleteTheme(id: string) {
    if (!confirm("Delete this theme and all its subthemes?")) return;
    await deleteTheme(id);
    setPillars(
      pillars.map((p) => ({
        ...p,
        themes: p.themes.filter((t) => t.id !== id),
      }))
    );
  }

  async function handleDeleteSubtheme(id: string) {
    if (!confirm("Delete this subtheme?")) return;
    await deleteSubtheme(id);
    setPillars(
      pillars.map((p) => ({
        ...p,
        themes: p.themes.map((t) => ({
          ...t,
          subthemes: t.subthemes.filter((s) => s.id !== id),
        })),
      }))
    );
  }

  return (
    <div className="p-4">
      <PageHeader group="configuration" page="primary" />

      {/* Control bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {editMode && (
            <button
              onClick={handleAddPillar}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              + Add Pillar
            </button>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              editMode
                ? "bg-[#b7410e] text-white hover:bg-[#93380c]"
                : "bg-[#b7410e] text-white hover:bg-[#93380c]"
            }`}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>

        {editMode && (
          <div className="flex space-x-3">
            <Upload className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <Download className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          </div>
        )}
      </div>

      {/* Expand/Collapse controls */}
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={expandAll}
          className="text-sm text-gray-600 hover:underline"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="text-sm text-gray-600 hover:underline"
        >
          Collapse All
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-700">
            <th className="w-1/4 px-2 py-2">Type / Ref Code</th>
            <th className="w-1/2 px-2 py-2">Name / Description</th>
            <th className="w-1/8 px-2 py-2 text-center">Sort Order</th>
            <th className="w-1/8 px-2 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {/* Rendering rows... unchanged */}
          {pillars.map((pillar) => (
            <>
              {/* Pillar row */}
              <tr key={pillar.id} className="border-b">
                <td className="px-2 py-2 align-top">
                  <div className="flex items-center space-x-2">
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      Pillar
                    </span>
                    <span className="text-gray-500 text-xs">{pillar.ref_code}</span>
                  </div>
                </td>
                <td className="px-2 py-2">{pillar.name}</td>
                <td className="px-2 py-2 text-center">{pillar.sort_order}</td>
                <td className="px-2 py-2 text-right space-x-2">
                  {editMode && (
                    <>
                      <button
                        onClick={() => handleAddTheme(pillar.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePillar(pillar.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes.map((theme) => (
                  <>
                    <tr key={theme.id} className="border-b">
                      <td className="px-2 py-2 pl-8 align-top">
                        <div className="flex items-center space-x-2">
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
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            Theme
                          </span>
                          <span className="text-gray-500 text-xs">{theme.ref_code}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2">{theme.name}</td>
                      <td className="px-2 py-2 text-center">{theme.sort_order}</td>
                      <td className="px-2 py-2 text-right space-x-2">
                        {editMode && (
                          <>
                            <button
                              onClick={() => handleAddSubtheme(theme.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTheme(theme.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Subthemes */}
                    {expanded[theme.id] &&
                      theme.subthemes.map((s) => (
                        <tr key={s.id} className="border-b">
                          <td className="px-2 py-2 pl-16 align-top">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                Subtheme
                              </span>
                              <span className="text-gray-500 text-xs">{s.ref_code}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2">{s.name}</td>
                          <td className="px-2 py-2 text-center">{s.sort_order}</td>
                          <td className="px-2 py-2 text-right space-x-2">
                            {editMode && (
                              <button
                                onClick={() => handleDeleteSubtheme(s.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
  );
}

export default FrameworkEditor;
