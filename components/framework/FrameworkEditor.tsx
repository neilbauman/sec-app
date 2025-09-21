// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
} from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const onRemoveSubtheme = (pillarId: string, themeId: string, subId: string) =>
    setPillars(removeSubtheme(pillars, pillarId, themeId, subId));

  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  const expandAll = () => {
    const pillarState: Record<string, boolean> = {};
    const themeState: Record<string, boolean> = {};
    pillars.forEach((p) => {
      pillarState[p.id] = true;
      p.themes.forEach((t) => (themeState[t.id] = true));
    });
    setOpenPillars(pillarState);
    setOpenThemes(themeState);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        {/* Left side → expand/collapse */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={expandAll}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            Expand All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={collapseAll}
            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            Collapse All
          </Button>
        </div>

        {/* Right side → add pillar, bulk edit, edit mode */}
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={onAddPillar}
          >
            + Add Pillar
          </Button>

          {editMode && (
            <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Bulk Edit</span>
              <Button size="sm" variant="ghost">
                <Upload className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost">
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
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="w-[25%] px-3 py-2 text-left">Type / Ref Code</th>
              <th className="w-[45%] px-3 py-2 text-left">Name / Description</th>
              <th className="w-[15%] px-3 py-2 text-center">Sort</th>
              <th className="w-[15%] px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <PillarRow
                key={pillar.id}
                pillar={pillar}
                open={openPillars[pillar.id]}
                toggle={togglePillar}
                editMode={editMode}
                openThemes={openThemes}
                toggleTheme={toggleTheme}
                onAddTheme={onAddTheme}
                onRemovePillar={onRemovePillar}
                onRemoveTheme={onRemoveTheme}
                onAddSubtheme={onAddSubtheme}
                onRemoveSubtheme={onRemoveSubtheme}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Pillar Row ----------
function PillarRow({
  pillar,
  open,
  toggle,
  editMode,
  openThemes,
  toggleTheme,
  onAddTheme,
  onRemovePillar,
  onRemoveTheme,
  onAddSubtheme,
  onRemoveSubtheme,
}: {
  pillar: NormalizedPillar;
  open?: boolean;
  toggle: (id: string) => void;
  editMode: boolean;
  openThemes: Record<string, boolean>;
  toggleTheme: (id: string) => void;
  onAddTheme: (pillarId: string) => void;
  onRemovePillar: (pillarId: string) => void;
  onRemoveTheme: (pillarId: string, themeId: string) => void;
  onAddSubtheme: (pillarId: string, themeId: string) => void;
  onRemoveSubtheme: (pillarId: string, themeId: string, subId: string) => void;
}) {
  return (
    <>
      <tr className="border-t">
        <td className="px-3 py-2 align-top">
          <div className="flex items-center gap-1">
            {pillar.themes.length > 0 && (
              <button onClick={() => toggle(pillar.id)} className="text-gray-500">
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <Badge variant="default">Pillar</Badge>
            <span className="text-xs text-gray-500">{pillar.ref_code}</span>
          </div>
        </td>
        <td className="px-3 py-2 align-top">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-xs text-gray-500">{pillar.description}</div>
        </td>
        <td className="px-3 py-2 text-center align-top">{pillar.sort_order}</td>
        <td className="px-3 py-2 text-right align-top">
          {editMode && (
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => onAddTheme(pillar.id)}>
                <Plus className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemovePillar(pillar.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          )}
        </td>
      </tr>

      {open &&
        pillar.themes.map((theme) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            pillarId={pillar.id}
            editMode={editMode}
            open={openThemes[theme.id]}
            toggle={toggleTheme}
            onAddSubtheme={onAddSubtheme}
            onRemoveTheme={onRemoveTheme}
            onRemoveSubtheme={onRemoveSubtheme}
          />
        ))}
    </>
  );
}

// ---------- Theme Row ----------
function ThemeRow({
  theme,
  pillarId,
  editMode,
  open,
  toggle,
  onAddSubtheme,
  onRemoveTheme,
  onRemoveSubtheme,
}: {
  theme: NormalizedTheme;
  pillarId: string;
  editMode: boolean;
  open?: boolean;
  toggle: (id: string) => void;
  onAddSubtheme: (pillarId: string, themeId: string) => void;
  onRemoveTheme: (pillarId: string, themeId: string) => void;
  onRemoveSubtheme: (pillarId: string, themeId: string, subId: string) => void;
}) {
  return (
    <>
      <tr className="border-t bg-gray-50">
        <td className="px-6 py-2 align-top">
          <div className="flex items-center gap-1">
            {theme.subthemes.length > 0 && (
              <button onClick={() => toggle(theme.id)} className="text-gray-500">
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <Badge variant="success">Theme</Badge>
            <span className="text-xs text-gray-500">{theme.ref_code}</span>
          </div>
        </td>
        <td className="px-3 py-2 align-top">
          <div className="font-medium">{theme.name}</div>
          <div className="text-xs text-gray-500">{theme.description}</div>
        </td>
        <td className="px-3 py-2 text-center align-top">{theme.sort_order}</td>
        <td className="px-3 py-2 text-right align-top">
          {editMode && (
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddSubtheme(pillarId, theme.id)}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveTheme(pillarId, theme.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          )}
        </td>
      </tr>

      {open &&
        theme.subthemes.map((sub) => (
          <tr key={sub.id} className="border-t bg-gray-100">
            <td className="px-10 py-2 align-top">
              <div className="flex items-center gap-1">
                <Badge variant="danger">Subtheme</Badge>
                <span className="text-xs text-gray-500">{sub.ref_code}</span>
              </div>
            </td>
            <td className="px-3 py-2 align-top">
              <div className="font-medium">{sub.name}</div>
              <div className="text-xs text-gray-500">{sub.description}</div>
            </td>
            <td className="px-3 py-2 text-center align-top">{sub.sort_order}</td>
            <td className="px-3 py-2 text-right align-top">
              {editMode && (
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveSubtheme(pillarId, theme.id, sub.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
    </>
  );
}
