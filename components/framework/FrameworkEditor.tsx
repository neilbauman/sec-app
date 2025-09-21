// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  addPillar,
  addTheme,
  addSubtheme,
} from "@/lib/framework-actions";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
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
  };

  const collapseAll = () => {
    setExpanded({});
  };

  // Action handlers
  const onAddPillar = () => {
    const updated = addPillar(pillars);
    setPillars(updated);
  };

  const onAddTheme = (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    setPillars(updated);
  };

  const onAddSubtheme = (themeId: string) => {
    const updated = addSubtheme(pillars, themeId);
    setPillars(updated);
  };

  // Helpers for rendering
  const renderBadge = (type: "pillar" | "theme" | "subtheme") => {
    switch (type) {
      case "pillar":
        return <Badge variant="default">Pillar</Badge>;
      case "theme":
        return <Badge variant="success">Theme</Badge>;
      case "subtheme":
        return <Badge variant="danger">Subtheme</Badge>;
    }
  };

  const renderRow = (
    item: NormalizedPillar | NormalizedTheme | NormalizedSubtheme,
    type: "pillar" | "theme" | "subtheme",
    parentId?: string
  ) => {
    const isExpanded = expanded[item.id] ?? false;
    const hasChildren =
      type === "pillar"
        ? (item as NormalizedPillar).themes.length > 0
        : type === "theme"
        ? (item as NormalizedTheme).subthemes.length > 0
        : false;

    return (
      <React.Fragment key={item.id}>
        <tr>
          {/* Type/Ref Code */}
          <td
            className={`px-4 py-2 align-top ${
              type === "theme" ? "pl-8" : type === "subtheme" ? "pl-12" : ""
            }`}
          >
            <div className="flex items-center space-x-1">
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
              {renderBadge(type)}
              <span className="text-xs text-gray-500 ml-1">
                {(item as any).ref_code}
              </span>
            </div>
          </td>

          {/* Name/Description */}
          <td className="px-4 py-2 align-top">
            <div>
              <div className="font-medium">{item.name}</div>
              {item.description && (
                <div className="text-sm text-gray-500">{item.description}</div>
              )}
            </div>
          </td>

          {/* Sort Order */}
          <td className="px-4 py-2 align-top text-center">
            {item.sort_order}
          </td>

          {/* Actions (edit mode only) */}
          <td className="px-4 py-2 align-top text-right">
            {editMode && (
              <div className="flex space-x-1 justify-end">
                {type === "pillar" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddTheme(item.id)}
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </Button>
                )}
                {type === "theme" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddSubtheme(item.id)}
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  title="Remove not yet implemented"
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            )}
          </td>
        </tr>

        {/* Children rows */}
        {isExpanded && type === "pillar" && (item as NormalizedPillar).themes.map((theme) =>
          renderRow(theme, "theme", item.id)
        )}
        {isExpanded && type === "theme" && (item as NormalizedTheme).subthemes.map((sub) =>
          renderRow(sub, "subtheme", item.id)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex space-x-2">
          {editMode && (
            <Button size="sm" variant="default" onClick={onAddPillar}>
              + Add Pillar
            </Button>
          )}
          <Button
            size="sm"
            variant={editMode ? "destructive" : "default"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left w-1/4">Type / Ref Code</th>
            <th className="px-4 py-2 text-left w-1/2">Name / Description</th>
            <th className="px-4 py-2 text-center w-1/8">Sort Order</th>
            <th className="px-4 py-2 text-right w-1/8">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => renderRow(pillar, "pillar"))}
        </tbody>
      </table>
    </div>
  );
}
