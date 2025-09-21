// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, ChevronsUp, ChevronsDown, Upload, Download } from "lucide-react";
import { NestedPillar, NestedTheme, Subtheme } from "@/lib/framework-client";
import { addPillar, addTheme, addSubtheme, deletePillar, deleteTheme, deleteSubtheme } from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // ----- Helpers -----
  function getRefCodePillar(idx: number) {
    return `P${idx + 1}`;
  }
  function getRefCodeTheme(pillarIndex: number, themeIndex: number) {
    return `T${pillarIndex + 1}.${themeIndex + 1}`;
  }
  function getRefCodeSub(pillarIndex: number, themeIndex: number, subIndex: number) {
    return `ST${pillarIndex + 1}.${themeIndex + 1}.${subIndex + 1}`;
  }

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

  // ----- Add Handlers -----
  async function handleAddPillar() {
    const name = prompt("Enter pillar name:");
    if (!name) return;
    await addPillar({ name, description: "", sort_order: pillars.length + 1 });
    window.location.reload();
  }

  async function handleAddTheme(pillarId: string, pillarIndex: number) {
    const name = prompt("Enter theme name:");
    if (!name) return;
    const count = pillars[pillarIndex].themes.length;
    await addTheme({
      pillar_id: pillarId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  async function handleAddSubtheme(themeId: string, pillarIndex: number, themeIndex: number) {
    const name = prompt("Enter subtheme name:");
    if (!name) return;
    const count = pillars[pillarIndex].themes[themeIndex].subthemes.length;
    await addSubtheme({
      theme_id: themeId,
      name,
      description: "",
      sort_order: count + 1,
    });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Configuration", href: "/configuration" }, { label: "Primary Framework" }]}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100 flex items-center gap-1"
          >
            <ChevronsDown className="w-4 h-4" /> Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100 flex items-center gap-1"
          >
            <ChevronsUp className="w-4 h-4" /> Collapse All
          </button>
          {editMode && (
            <button
              onClick={handleAddPillar}
              className="px-2 py-1 text-sm border rounded text-blue-600 hover:bg-blue-50 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Pillar
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Upload className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-2 py-1 text-sm border rounded text-[#b7410e] hover:bg-orange-50 flex items-center gap-1"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="w-[20%] px-3 py-2">Type / Ref Code</th>
              <th className="w-[55%] px-3 py-2">Name / Description</th>
              <th className="w-[10%] px-3 py-2 text-center">Sort</th>
              <th className="w-[15%] px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar, pIdx) => (
              <tr key={pillar.id} className="border-t">
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleExpand(pillar.id)} className="text-gray-500 hover:text-gray-700">
                      {expanded[pillar.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">Pillar</span>
                    <span className="text-gray-500 text-xs">{getRefCodePillar(pIdx)}</span>
                  </div>
                </td>
                <td className="px-3 py-2">{pillar.name}</td>
                <td className="px-3 py-2 text-center">{pillar.sort_order}</td>
                <td className="px-3 py-2 text-right">
                  {editMode && (
                    <>
                      <button onClick={() => handleAddTheme(pillar.id, pIdx)} className="p-1 text-gray-500 hover:text-gray-700">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePillar(pillar.id).then(() => window.location.reload())} className="p-1 text-red-500 hover:text-red-700">
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
