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
import { Button } from "@/components/ui/button"; // ✅ fixed import
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

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            onClick={onAddPillar}
          >
            + Add Pillar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-100"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
        </div>
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="w-[25%] px-3 py-2 text-left">Type / Ref Code</th>
              <th className="w-[45%] px-3 py-2 text-left">Name / Description</th>
              <th className="w-[15%] px-3 py-2 text-center">Sort Order</th>
              <th className="w-[15%] px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar, pi) => (
              <PillarRow
                key={pillar.id}
                pillar={pillar}
                open={openPillars[pillar.id]}
                toggle={togglePillar}
                editMode={editMode}
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
  onAddTheme: (id: string) => void;
  onRemovePillar: (id: string) => void;
  onRemoveTheme: (pillarId: string, themeId: string) => void;
  onAddSubtheme: (pillarId: string, themeId: string) => void;
  onRemoveSubtheme: (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => void;
}) {
  return (
    <>
      <tr className="border-t">
        <td className="px-3 py-2 align-top">
          <div className="flex items-center gap-1">
            <button onClick={() => toggle(pillar.id)} className="mr-1">
              {open ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <Badge>Pillar</Badge>
            <span className="text-xs text-gray-500 ml-1">{pillar.ref_code}</span>
          </div>
        </td>
        <td className="px-3 py-2">{pillar.name}</td>
        <td className="px-3 py-2 text-center">{pillar.sort_order}</td>
        <td className="px-3 py-2 text-right">
          {editMode && (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => onAddTheme(pillar.id)}>
                <Plus className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onRemovePillar(pillar.id)}>
                <Trash2 className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          )}
        </td>
      </tr>
      {open &&
        pillar.themes.map((theme) => (
          <ThemeRow
            key={theme.id}
            pillar={pillar}
            theme={theme}
            editMode={editMode}
            onRemoveTheme={onRemoveTheme}
            onAddSubtheme={onAddSubtheme}
            onRemoveSubtheme={onRemoveSubtheme}
          />
        ))}
    </>
  );
}

// ---------- Theme Row ----------
function ThemeRow({
  pillar,
  theme,
  editMode,
  onRemoveTheme,
  onAddSubtheme,
  onRemoveSubtheme,
}: {
  pillar: NormalizedPillar;
  theme: NormalizedTheme;
  editMode: boolean;
  onRemoveTheme: (pillarId: string, themeId: string) => void;
  onAddSubtheme: (pillarId: string, themeId: string) => void;
  onRemoveSubtheme: (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => void;
}) {
  return (
    <>
      <tr className="border-t">
        <td className="px-3 py-2 pl-8">
          <div className="flex items-center gap-1">
            <Badge variant="success">Theme</Badge>
            <span className="text-xs text-gray-500 ml-1">{theme.ref_code}</span>
          </div>
        </td>
        <td className="px-3 py-2 pl-8">{theme.name}</td>
        <td className="px-3 py-2 text-center">{theme.sort_order}</td>
        <td className="px-3 py-2 text-right">
          {editMode && (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddSubtheme(pillar.id, theme.id)}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveTheme(pillar.id, theme.id)}
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          )}
        </td>
      </tr>
      {theme.subthemes.map((sub) => (
        <tr key={sub.id} className="border-t">
          <td className="px-3 py-2 pl-12">
            <div className="flex items-center gap-1">
              <Badge variant="danger">Subtheme</Badge>
              <span className="text-xs text-gray-500 ml-1">{sub.ref_code}</span>
            </div>
          </td>
          <td className="px-3 py-2 pl-12">{sub.name}</td>
          <td className="px-3 py-2 text-center">{sub.sort_order}</td>
          <td className="px-3 py-2 text-right">
            {editMode && (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onRemoveSubtheme(pillar.id, theme.id, sub.id)
                  }
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}
