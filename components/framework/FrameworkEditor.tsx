// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getFrameworkClient } from "@/lib/framework-client";

// ---------------- Types ----------------
type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

// ---------------- Component ----------------
export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const supabase = getFrameworkClient();

  // ---------- Save helper ----------
  async function saveFramework(updated: NormalizedPillar[]) {
    setPillars(updated);
    // Save JSON into framework_config table (id=1 row)
    const { error } = await supabase
      .from("framework_config")
      .update({ config: updated })
      .eq("id", 1);

    if (error) console.error("Failed to save framework:", error);
  }

  // ---------- Action handlers ----------
  const onAddPillar = () => {
    const updated = addPillar(pillars);
    saveFramework(updated);
  };

  const onAddTheme = (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    saveFramework(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
  };

  const onAddSubtheme = (pillarId: string, themeId: string) => {
    const updated = addSubtheme(pillars, pillarId, themeId);
    saveFramework(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
    setOpenThemes((s) => ({ ...s, [themeId]: true }));
  };

  const onRemovePillar = (pillarId: string) => {
    const updated = removePillar(pillars, pillarId);
    saveFramework(updated);
  };

  const onRemoveTheme = (pillarId: string, themeId: string) => {
    const updated = removeTheme(pillars, pillarId, themeId);
    saveFramework(updated);
  };

  const onRemoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => {
    const updated = removeSubtheme(pillars, pillarId, themeId, subthemeId);
    saveFramework(updated);
  };

  // ---------- Row components ----------
  const PillarRow = ({ pillar }: { pillar: NormalizedPillar }) => {
    const isOpen = openPillars[pillar.id];
    return (
      <>
        <tr>
          <td className="px-2 py-1">
            <button
              onClick={() =>
                setOpenPillars((s) => ({ ...s, [pillar.id]: !s[pillar.id] }))
              }
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </td>
          <td className="px-2 py-1">
            <Badge variant="default">Pillar</Badge>
            <div className="font-medium">{pillar.name}</div>
            <div className="text-xs text-gray-500">{pillar.description}</div>
          </td>
          <td className="px-2 py-1 text-sm">{pillar.ref_code}</td>
          <td className="px-2 py-1 text-sm">{pillar.sort_order}</td>
          <td className="px-2 py-1 flex gap-2">
            {editMode && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddTheme(pillar.id)}
                >
                  <Plus size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemovePillar(pillar.id)}
                >
                  <Trash2 size={14} />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit2 size={14} />
                </Button>
              </>
            )}
          </td>
        </tr>
        {isOpen &&
          pillar.themes.map((theme) => (
            <ThemeRow key={theme.id} theme={theme} pillar={pillar} />
          ))}
      </>
    );
  };

  const ThemeRow = ({
    theme,
    pillar,
  }: {
    theme: NormalizedTheme;
    pillar: NormalizedPillar;
  }) => {
    const isOpen = openThemes[theme.id];
    return (
      <>
        <tr>
          <td className="px-6 py-1">
            <button
              onClick={() =>
                setOpenThemes((s) => ({ ...s, [theme.id]: !s[theme.id] }))
              }
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </td>
          <td className="px-2 py-1">
            <Badge variant="success">Theme</Badge>
            <div className="font-medium">{theme.name}</div>
            <div className="text-xs text-gray-500">{theme.description}</div>
          </td>
          <td className="px-2 py-1 text-sm">{theme.ref_code}</td>
          <td className="px-2 py-1 text-sm">{theme.sort_order}</td>
          <td className="px-2 py-1 flex gap-2">
            {editMode && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddSubtheme(pillar.id, theme.id)}
                >
                  <Plus size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveTheme(pillar.id, theme.id)}
                >
                  <Trash2 size={14} />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit2 size={14} />
                </Button>
              </>
            )}
          </td>
        </tr>
        {isOpen &&
          theme.subthemes.map((sub) => (
            <SubthemeRow
              key={sub.id}
              subtheme={sub}
              pillar={pillar}
              theme={theme}
            />
          ))}
      </>
    );
  };

  const SubthemeRow = ({
    subtheme,
    pillar,
    theme,
  }: {
    subtheme: NormalizedSubtheme;
    pillar: NormalizedPillar;
    theme: NormalizedTheme;
  }) => (
    <tr>
      <td className="px-10 py-1"></td>
      <td className="px-2 py-1">
        <Badge variant="danger">Subtheme</Badge>
        <div className="font-medium">{subtheme.name}</div>
        <div className="text-xs text-gray-500">{subtheme.description}</div>
      </td>
      <td className="px-2 py-1 text-sm">{subtheme.ref_code}</td>
      <td className="px-2 py-1 text-sm">{subtheme.sort_order}</td>
      <td className="px-2 py-1 flex gap-2">
        {editMode && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveSubtheme(pillar.id, theme.id, subtheme.id)}
            >
              <Trash2 size={14} />
            </Button>
            <Button size="sm" variant="ghost">
              <Edit2 size={14} />
            </Button>
          </>
        )}
      </td>
    </tr>
  );

  // ---------- Main render ----------
  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        {editMode && (
          <Button size="sm" variant="outline" onClick={onAddPillar}>
            + Add Pillar
          </Button>
        )}
        <Button size="sm" variant="outline">
          Bulk Edit
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-1"></th>
            <th className="px-2 py-1 text-left">Name / Description</th>
            <th className="px-2 py-1 text-left">Ref Code</th>
            <th className="px-2 py-1 text-left">Sort</th>
            <th className="px-2 py-1 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <PillarRow key={pillar.id} pillar={pillar} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
