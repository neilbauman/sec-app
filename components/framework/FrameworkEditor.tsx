// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
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

  // ----- Handlers -----
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
    setPillars(removePillar(pillars, pillarId));
  };

  const onRemoveTheme = (pillarId: string, themeId: string) => {
    setPillars(removeTheme(pillars, pillarId, themeId));
  };

  const onRemoveSubtheme = (pillarId: string, themeId: string, subthemeId: string) => {
    setPillars(removeSubtheme(pillars, pillarId, themeId, subthemeId));
  };

  const toggleExpandAll = (expand: boolean) => {
    const pillarState: Record<string, boolean> = {};
    const themeState: Record<string, boolean> = {};
    pillars.forEach((p) => {
      pillarState[p.id] = expand;
      p.themes.forEach((t) => {
        themeState[t.id] = expand;
      });
    });
    setOpenPillars(pillarState);
    setOpenThemes(themeState);
  };

  const onSaveFramework = async () => {
    const res = await fetch("/api/framework/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pillars }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Framework saved successfully!");
    } else {
      alert("Error saving: " + data.error);
    }
  };

  // ----- Rows -----
  const renderSubthemeRow = (
    sub: NormalizedSubtheme,
    pillarId: string,
    themeId: string,
    depth: number
  ) => (
    <tr key={sub.id}>
      <td className="pl-10">
        <Badge variant="danger">Subtheme</Badge>
      </td>
      <td>{sub.ref_code}</td>
      <td className="pl-8">{sub.name}</td>
      <td>{sub.description}</td>
      <td>{sub.sort_order}</td>
      <td className="flex gap-2">
        <Button size="sm" variant="ghost">
          <Edit3 className="w-4 h-4 text-gray-600" />
        </Button>
        {editMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveSubtheme(pillarId, themeId, sub.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        )}
      </td>
    </tr>
  );

  const renderThemeRow = (theme: NormalizedTheme, pillarId: string, depth: number) => {
    const isOpen = openThemes[theme.id];
    return (
      <React.Fragment key={theme.id}>
        <tr>
          <td className="pl-6">
            <button onClick={() => setOpenThemes((s) => ({ ...s, [theme.id]: !isOpen }))}>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <Badge variant="success">Theme</Badge>
          </td>
          <td>{theme.ref_code}</td>
          <td className="pl-8">{theme.name}</td>
          <td>{theme.description}</td>
          <td>{theme.sort_order}</td>
          <td className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </Button>
            {editMode && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddSubtheme(pillarId, theme.id)}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveTheme(pillarId, theme.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </>
            )}
          </td>
        </tr>
        {isOpen && theme.subthemes.map((s) => renderSubthemeRow(s, pillarId, theme.id, depth + 1))}
      </React.Fragment>
    );
  };

  const renderPillarRow = (pillar: NormalizedPillar, depth: number) => {
    const isOpen = openPillars[pillar.id];
    return (
      <React.Fragment key={pillar.id}>
        <tr>
          <td>
            <button onClick={() => setOpenPillars((s) => ({ ...s, [pillar.id]: !isOpen }))}>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <Badge>Pillar</Badge>
          </td>
          <td>{pillar.ref_code}</td>
          <td className="pl-8">{pillar.name}</td>
          <td>{pillar.description}</td>
          <td>{pillar.sort_order}</td>
          <td className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </Button>
            {editMode && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddTheme(pillar.id)}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
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
        {isOpen && pillar.themes.map((t) => renderThemeRow(t, pillar.id, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="primary" onClick={onSaveFramework}>
          Save Framework
        </Button>
        {editMode && (
          <Button size="sm" variant="primary" onClick={onAddPillar}>
            + Add Pillar
          </Button>
        )}
        <Button size="sm" variant="rust" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
        <div className="border rounded-md px-3 py-1 text-sm flex items-center">
          Bulk Edit (CSV Upload/Download)
        </div>
      </div>

      {/* Expand/Collapse */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => toggleExpandAll(true)}>
          Expand All
        </Button>
        <Button size="sm" variant="outline" onClick={() => toggleExpandAll(false)}>
          Collapse All
        </Button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-2 py-1">Type</th>
            <th className="text-left px-2 py-1">Ref Code</th>
            <th className="text-left px-2 py-1">Name</th>
            <th className="text-left px-2 py-1">Description</th>
            <th className="text-left px-2 py-1">Sort</th>
            <th className="text-left px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => renderPillarRow(pillar, 0))}
        </tbody>
      </table>
    </div>
  );
}
