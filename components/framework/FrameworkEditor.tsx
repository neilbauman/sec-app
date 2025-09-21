// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Download,
  Pencil,
} from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // ---------- Expand/Collapse ----------
  const expandAll = () => {
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    pillars.forEach((pillar) => {
      p[pillar.id] = true;
      pillar.themes.forEach((theme) => {
        t[theme.id] = true;
      });
    });
    setOpenPillars(p);
    setOpenThemes(t);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Action handlers ----------
  const onAddPillar = () => {
    const updated = addPillar(pillars);
    setPillars(updated);
  };

  const onAddTheme = (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
  };

  const onAddSubtheme = (pillarId: string, themeId: string) => {
    const updated = addSubtheme(pillars, pillarId, themeId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
    setOpenThemes((s) => ({ ...s, [themeId]: true }));
  };

  const onRemovePillar = (pillarId: string) => {
    const updated = removePillar(pillars, pillarId);
    setPillars(updated);
  };

  const onRemoveTheme = (pillarId: string, themeId: string) => {
    const updated = removeTheme(pillars, pillarId, themeId);
    setPillars(updated);
  };

  const onRemoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => {
    const updated = removeSubtheme(pillars, pillarId, themeId, subthemeId);
    setPillars(updated);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          {editMode && (
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={onAddPillar}
            >
              + Add Pillar
            </Button>
          )}

          {editMode && (
            <div className="flex items-center gap-1 border rounded-md bg-gray-50 px-2 h-8">
              <span className="text-xs font-medium text-gray-600 mr-1">
                Bulk Edit
              </span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Upload className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Download className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-100"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 rounded-md text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left w-8"></th>
            <th className="px-2 py-2 text-left w-24">Type</th>
            <th className="px-2 py-2 text-left w-24">Ref Code</th>
            <th className="px-2 py-2 text-left">Name</th>
            <th className="px-2 py-2 text-left">Description</th>
            <th className="px-2 py-2 text-left w-16">Sort</th>
            <th className="px-2 py-2 text-left w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              {/* Pillar Row */}
              <tr className="border-t">
                <td className="px-2 py-1">
                  <button
                    onClick={() =>
                      setOpenPillars((s) => ({
                        ...s,
                        [pillar.id]: !s[pillar.id],
                      }))
                    }
                  >
                    {openPillars[pillar.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td className="px-2 py-1">
                  <Badge>Pillar</Badge>
                </td>
                <td className="px-2 py-1">{pillar.ref_code}</td>
                <td className="px-2 py-1 font-medium">{pillar.name}</td>
                <td className="px-2 py-1 text-gray-600">{pillar.description}</td>
                <td className="px-2 py-1 text-center">{pillar.sort_order}</td>
                <td className="px-2 py-1 flex gap-2">
                  {editMode && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAddTheme(pillar.id)}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemovePillar(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>

              {/* Theme Rows */}
              {openPillars[pillar.id] &&
                pillar.themes.map((theme) => (
                  <React.Fragment key={theme.id}>
                    <tr className="border-t bg-gray-50">
                      <td className="px-2 py-1 pl-8">
                        <button
                          onClick={() =>
                            setOpenThemes((s) => ({
                              ...s,
                              [theme.id]: !s[theme.id],
                            }))
                          }
                        >
                          {openThemes[theme.id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-2 py-1">
                        <Badge variant="success">Theme</Badge>
                      </td>
                      <td className="px-2 py-1">{theme.ref_code}</td>
                      <td className="px-2 py-1 pl-4">{theme.name}</td>
                      <td className="px-2 py-1 text-gray-600">
                        {theme.description}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {theme.sort_order}
                      </td>
                      <td className="px-2 py-1 flex gap-2">
                        {editMode && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onAddSubtheme(pillar.id, theme.id)}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRemoveTheme(pillar.id, theme.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Subtheme Rows */}
                    {openThemes[theme.id] &&
                      theme.subthemes.map((sub) => (
                        <tr className="border-t" key={sub.id}>
                          <td className="px-2 py-1 pl-16"></td>
                          <td className="px-2 py-1">
                            <Badge variant="danger">Subtheme</Badge>
                          </td>
                          <td className="px-2 py-1">{sub.ref_code}</td>
                          <td className="px-2 py-1 pl-8">{sub.name}</td>
                          <td className="px-2 py-1 text-gray-600">
                            {sub.description}
                          </td>
                          <td className="px-2 py-1 text-center">
                            {sub.sort_order}
                          </td>
                          <td className="px-2 py-1 flex gap-2">
                            {editMode && (
                              <>
                                <Button size="sm" variant="ghost">
                                  <Pencil className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    onRemoveSubtheme(pillar.id, theme.id, sub.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
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
