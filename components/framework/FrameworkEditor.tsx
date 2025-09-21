// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge"; // ✅ fixed import
import { Button } from "@/components/ui/button";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import type {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    pillars.forEach((p) => {
      all[p.id] = true;
      p.themes?.forEach((t) => {
        all[t.id] = true;
        t.subthemes?.forEach((s) => {
          all[s.id] = true;
        });
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

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
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronDown className="w-4 h-4 mr-1" /> Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronRight className="w-4 h-4 mr-1" /> Collapse All
          </Button>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
              onClick={handleAddPillar}
            >
              + Add Pillar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="bg-[#b7410e]/10 text-[#b7410e] hover:bg-[#b7410e]/20"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-2 w-1/5">Type / Ref Code</th>
              <th className="px-4 py-2 w-3/5">Name / Description</th>
              <th className="px-4 py-2 w-1/10 text-center">Sort</th>
              <th className="px-4 py-2 w-1/10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <FrameworkRow
                key={pillar.id}
                item={pillar}
                type="pillar"
                expanded={expanded}
                toggleExpand={toggleExpand}
                editMode={editMode}
                onAddTheme={handleAddTheme}
                onAddSubtheme={handleAddSubtheme}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type FrameworkRowProps = {
  item: NormalizedPillar | NormalizedTheme | NormalizedSubtheme;
  type: "pillar" | "theme" | "subtheme";
  expanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  onAddTheme: (pillarId: string) => void;
  onAddSubtheme: (themeId: string) => void;
};

function FrameworkRow({
  item,
  type,
  expanded,
  toggleExpand,
  editMode,
  onAddTheme,
  onAddSubtheme,
}: FrameworkRowProps) {
  const isExpanded = expanded[item.id];
  const hasChildren =
    (type === "pillar" && (item as NormalizedPillar).themes?.length > 0) ||
    (type === "theme" && (item as NormalizedTheme).subthemes?.length > 0);

  const badgeColor =
    type === "pillar"
      ? "bg-blue-100 text-blue-600"
      : type === "theme"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";

  return (
    <>
      <tr className="border-t">
        <td className="px-4 py-2 align-top">
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(item.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <Badge className={badgeColor}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <span className="text-gray-500 text-xs">{item.ref_code}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <div className="font-medium">{item.name}</div>
          <div className="text-gray-500 text-xs">{item.description}</div>
        </td>
        <td className="px-4 py-2 text-center">{item.sort_order}</td>
        <td className="px-4 py-2 text-right">
          {editMode && (
            <div className="flex justify-end gap-2">
              {type === "pillar" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddTheme(item.id)}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
              )}
              {type === "theme" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddSubtheme(item.id)}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          )}
        </td>
      </tr>

      {isExpanded &&
        type === "pillar" &&
        (item as NormalizedPillar).themes?.map((theme) => (
          <FrameworkRow
            key={theme.id}
            item={theme}
            type="theme"
            expanded={expanded}
            toggleExpand={toggleExpand}
            editMode={editMode}
            onAddTheme={onAddTheme}
            onAddSubtheme={onAddSubtheme}
          />
        ))}

      {isExpanded &&
        type === "theme" &&
        (item as NormalizedTheme).subthemes?.map((s) => (
          <FrameworkRow
            key={s.id}
            item={s}
            type="subtheme"
            expanded={expanded}
            toggleExpand={toggleExpand}
            editMode={editMode}
            onAddTheme={onAddTheme}
            onAddSubtheme={onAddSubtheme}
          />
        ))}
    </>
  );
}
