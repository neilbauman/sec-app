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
  const [editMode, setEditMode] = useState(false);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // ---------- Expand/Collapse ----------
  const expandAll = () => {
    const allPillars: Record<string, boolean> = {};
    const allThemes: Record<string, boolean> = {};
    pillars.forEach((p) => {
      allPillars[p.id] = true;
      p.themes.forEach((t) => {
        allThemes[t.id] = true;
      });
    });
    setOpenPillars(allPillars);
    setOpenThemes(allThemes);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Actions ----------
  const onAddPillar = () => setPillars(addPillar(pillars));
  const onAddTheme = (pillarId: string) =>
    setPillars(addTheme(pillars, pillarId));
  const onAddSubtheme = (pillarId: string, themeId: string) =>
    setPillars(addSubtheme(pillars, pillarId, themeId));

  const onRemovePillar = (pillarId: string) =>
    setPillars(removePillar(pillars, pillarId));
  const onRemoveTheme = (pillarId: string, themeId: string) =>
    setPillars(removeTheme(pillars, pillarId, themeId));
  const onRemoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => setPillars(removeSubtheme(pillars, pillarId, themeId, subthemeId));

  // ---------- Renderers ----------
  const renderSubtheme = (
    sub: NormalizedSubtheme,
    pillarId: string,
    themeId: string
  ) => (
    <tr key={sub.id} className="border-t">
      <td className="pl-12 py-2 align-top">
        <Badge variant="danger">Subtheme</Badge>
        <span className="ml-1 text-gray-500 text-xs">{sub.ref_code}</span>
      </td>
      <td className="pl-4 py-2">
        <div className="font-medium">{sub.name}</div>
        {sub.description && (
          <div className="text-sm text-gray-500">{sub.description}</div>
        )}
      </td>
      <td className="text-center">{sub.sort_order}</td>
      <td className="text-right pr-4">
        {editMode && (
          <button
            onClick={() => onRemoveSubtheme(pillarId, themeId, sub.id)}
            className="p-1 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );

  const renderTheme = (theme: NormalizedTheme, pillarId: string) => (
    <React.Fragment key={theme.id}>
      <tr className="border-t">
        <td className="pl-8 py-2 align-top">
          <button
            onClick={() =>
              setOpenThemes((s) => ({ ...s, [theme.id]: !s[theme.id] }))
            }
            className="mr-1"
          >
            {openThemes[theme.id] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <Badge variant="success">Theme</Badge>
          <span className="ml-1 text-gray-500 text-xs">{theme.ref_code}</span>
        </td>
        <td className="pl-4 py-2">
          <div className="font-medium">{theme.name}</div>
          {theme.description && (
            <div className="text-sm text-gray-500">{theme.description}</div>
          )}
        </td>
        <td className="text-center">{theme.sort_order}</td>
        <td className="text-right pr-4 space-x-1">
          {editMode && (
            <>
              <button
                onClick={() => onAddSubtheme(pillarId, theme.id)}
                className="p-1 hover:text-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemoveTheme(pillarId, theme.id)}
                className="p-1 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </td>
      </tr>
      {openThemes[theme.id] &&
        theme.subthemes.map((s) => renderSubtheme(s, pillarId, theme.id))}
    </React.Fragment>
  );

  const renderPillar = (pillar: NormalizedPillar) => (
    <React.Fragment key={pillar.id}>
      <tr className="border-t">
        <td className="pl-4 py-2 align-top">
          <button
            onClick={() =>
              setOpenPillars((s) => ({ ...s, [pillar.id]: !s[pillar.id] }))
            }
            className="mr-1"
          >
            {openPillars[pillar.id] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <Badge>Pillar</Badge>
          <span className="ml-1 text-gray-500 text-xs">{pillar.ref_code}</span>
        </td>
        <td className="pl-4 py-2">
          <div className="font-medium">{pillar.name}</div>
          {pillar.description && (
            <div className="text-sm text-gray-500">{pillar.description}</div>
          )}
        </td>
        <td className="text-center">{pillar.sort_order}</td>
        <td className="text-right pr-4 space-x-1">
          {editMode && (
            <>
              <button
                onClick={() => onAddTheme(pillar.id)}
                className="p-1 hover:text-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemovePillar(pillar.id)}
                className="p-1 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </td>
      </tr>
      {openPillars[pillar.id] &&
        pillar.themes.map((t) => renderTheme(t, pillar.id))}
    </React.Fragment>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            <ChevronDown className="w-4 h-4 mr-1" /> Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            <ChevronRight className="w-4 h-4 mr-1" /> Collapse All
          </Button>
        </div>

        <div className="space-x-2 flex items-center">
          {editMode && (
            <>
              <Upload className="w-4 h-4 text-gray-600 cursor-pointer" />
              <Download className="w-4 h-4 text-gray-600 cursor-pointer" />
              <Button size="sm" variant="primary" onClick={onAddPillar}>
                + Add Pillar
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="rust"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border rounded-lg text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-2 px-4 w-1/4">Type / Ref Code</th>
            <th className="text-left py-2 px-4 w-2/4">Name / Description</th>
            <th className="text-center py-2 px-2 w-1/8">Sort</th>
            <th className="text-right py-2 px-4 w-1/8">Actions</th>
          </tr>
        </thead>
        <tbody>{pillars.map(renderPillar)}</tbody>
      </table>
    </div>
  );
}
