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
        t.subthemes.forEach((s) => {
          all[s.id] = true;
        });
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
    if (!pillar) return;
    const count = pillar.themes.length;

    // ⚡ Temporary patch: add pillar_code
    const newTheme: NestedTheme = {
      id: crypto.randomUUID(),
      pillar_id: pillarId,
      pillar_code: pillar.ref_code ?? "",
      name,
      description: "",
      sort_order: count + 1,
      ref_code: `T${pillar.sort_order}.${count + 1}`,
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

    // ⚡ Temporary patch: add theme_code
    const newSub: Subtheme = {
      id: crypto.randomUUID(),
      theme_id: themeId,
      theme_code: parentTheme.ref_code ?? "",
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

  return (
    <div className="p-4">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />

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
              <button
                onClick={() => alert("Upload CSV not implemented yet")}
                className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-600 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert("Download CSV not implemented yet")}
                className="flex items-center space-x-1 text-sm px-2 py-1 border rounded text-gray-600 hover:bg-gray-50"
              >
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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm font-medium text-gray-600">
            <th className="w-[25%] py-2">Type / Ref Code</th>
            <th className="w-[50%] py-2">Name / Description</th>
            <th className="w-[10%] text-center py-2">Sort Order</th>
            <th className="w-[15%] text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {pillars.map((pillar) => (
            <tr key={pillar.id} className="border-b align-top">
              <td className="py-2 pl-2">
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
                  <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-blue-700 text-xs font-medium">
                    Pillar
                  </span>
                  <span className="text-gray-400 text-xs">{pillar.ref_code}</span>
                </div>
              </td>
              <td className="py-2 pl-6">
                <div className="font-medium">{pillar.name}</div>
                <div className="text-gray-500 text-xs">
                  {pillar.description}
                </div>
              </td>
              <td className="py-2 text-center">{pillar.sort_order}</td>
              <td className="py-2 text-right">
                {editMode && (
                  <div className="flex justify-end space-x-2">
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
                            setPillars(pillars.filter((p) => p.id !== pillar.id))
                          );
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {/* Themes */}
          {pillars.map(
            (pillar) =>
              expanded[pillar.id] &&
              pillar.themes.map((theme) => (
                <tr key={theme.id} className="border-b align-top">
                  <td className="py-2 pl-6">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleExpand(theme.id)}
                        className="text-gray-500"
                      >
                        {expanded[theme.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs font-medium">
                        Theme
                      </span>
                      <span className="text-gray-400 text-xs">
                        {theme.ref_code}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pl-10">
                    <div>{theme.name}</div>
                    <div className="text-gray-500 text-xs">
                      {theme.description}
                    </div>
                  </td>
                  <td className="py-2 text-center">{theme.sort_order}</td>
                  <td className="py-2 text-right">
                    {editMode && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleAddSubtheme(theme.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete theme "${theme.name}"?`)) {
                              deleteTheme(theme.id).then(() =>
                                setPillars(
                                  pillars.map((p) =>
                                    p.id === pillar.id
                                      ? {
                                          ...p,
                                          themes: p.themes.filter(
                                            (t) => t.id !== theme.id
                                          ),
                                        }
                                      : p
                                  )
                                )
                              );
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
          )}
          {/* Subthemes */}
          {pillars.map(
            (pillar) =>
              pillar.themes.map(
                (theme) =>
                  expanded[theme.id] &&
                  theme.subthemes.map((s) => (
                    <tr key={s.id} className="border-b align-top">
                      <td className="py-2 pl-10">
                        <div className="flex items-center space-x-1">
                          <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-red-700 text-xs font-medium">
                            Subtheme
                          </span>
                          <span className="text-gray-400 text-xs">
                            {s.ref_code}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pl-14">
                        <div>{s.name}</div>
                        <div className="text-gray-500 text-xs">
                          {s.description}
                        </div>
                      </td>
                      <td className="py-2 text-center">{s.sort_order}</td>
                      <td className="py-2 text-right">
                        {editMode && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete subtheme "${s.name}"?`)) {
                                deleteSubtheme(s.id).then(() =>
                                  setPillars(
                                    pillars.map((p) =>
                                      p.id === pillar.id
                                        ? {
                                            ...p,
                                            themes: p.themes.map((t) =>
                                              t.id === theme.id
                                                ? {
                                                    ...t,
                                                    subthemes: t.subthemes.filter(
                                                      (sub) => sub.id !== s.id
                                                    ),
                                                  }
                                                : t
                                            ),
                                          }
                                        : p
                                    )
                                  )
                                );
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )
          )}
        </tbody>
      </table>
    </div>
  );
}
