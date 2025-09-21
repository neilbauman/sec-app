// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // Toggle expansion state
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Expand/collapse all
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

  const onAddSubtheme = (pillarId: string, themeId: string) => {
    const updated = addSubtheme(pillars, pillarId, themeId);
    setPillars(updated);
  };

  const onRemovePillar = (pillarId: string) => {
    setPillars(removePillar(pillars, pillarId));
  };

  const onRemoveTheme = (pillarId: string, themeId: string) => {
    setPillars(removeTheme(pillars, pillarId, themeId));
  };

  const onRemoveSubtheme = (pillarId: string, themeId: string, subthemeId: string) => {
    setPillars(removeSubtheme(pillars, pillarId, themeId, subthemeId));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex gap-2">
          <Button size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <Button size="sm" variant="primary" onClick={onAddPillar}>
              + Add Pillar
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[20%] px-2 py-2 text-left">Type / Ref Code</th>
            <th className="w-[50%] px-2 py-2 text-left">Name / Description</th>
            <th className="w-[15%] px-2 py-2 text-center">Sort Order</th>
            <th className="w-[15%] px-2 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              {/* Pillar row */}
              <tr className="border-t">
                <td className="px-2 py-2">
                  <button
                    onClick={() => toggleExpand(pillar.id)}
                    className="mr-1 text-gray-600"
                  >
                    {expanded[pillar.id] ? (
                      <ChevronDown className="w-4 h-4 inline" />
                    ) : (
                      <ChevronRight className="w-4 h-4 inline" />
                    )}
                  </button>
                  <Badge>Pillar</Badge>{" "}
                  <span className="text-xs text-gray-500">{pillar.ref_code}</span>
                </td>
                <td className="px-2 py-2">{pillar.name}</td>
                <td className="px-2 py-2 text-center">{pillar.sort_order}</td>
                <td className="px-2 py-2 text-right">
                  {editMode && (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={() => onAddTheme(pillar.id)}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={() => onRemovePillar(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>

              {/* Themes */}
              {expanded[pillar.id] &&
                pillar.themes.map((theme) => (
                  <React.Fragment key={theme.id}>
                    <tr className="border-t">
                      <td className="px-2 py-2 pl-6">
                        <button
                          onClick={() => toggleExpand(theme.id)}
                          className="mr-1 text-gray-600"
                        >
                          {expanded[theme.id] ? (
                            <ChevronDown className="w-4 h-4 inline" />
                          ) : (
                            <ChevronRight className="w-4 h-4 inline" />
                          )}
                        </button>
                        <Badge variant="success">Theme</Badge>{" "}
                        <span className="text-xs text-gray-500">{theme.ref_code}</span>
                      </td>
                      <td className="px-2 py-2">{theme.name}</td>
                      <td className="px-2 py-2 text-center">{theme.sort_order}</td>
                      <td className="px-2 py-2 text-right">
                        {editMode && (
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="subtle"
                              onClick={() => onAddSubtheme(pillar.id, theme.id)}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="subtle"
                              onClick={() => onRemoveTheme(pillar.id, theme.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Subthemes */}
                    {expanded[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr key={sub.id} className="border-t">
                          <td className="px-2 py-2 pl-10">
                            <Badge variant="danger">Subtheme</Badge>{" "}
                            <span className="text-xs text-gray-500">{sub.ref_code}</span>
                          </td>
                          <td className="px-2 py-2">{sub.name}</td>
                          <td className="px-2 py-2 text-center">{sub.sort_order}</td>
                          <td className="px-2 py-2 text-right">
                            {editMode && (
                              <Button
                                size="sm"
                                variant="subtle"
                                onClick={() =>
                                  onRemoveSubtheme(pillar.id, theme.id, sub.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
