// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // expand / collapse
  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  const expandAll = () => {
    const nextP: Record<string, boolean> = {};
    const nextT: Record<string, boolean> = {};
    pillars.forEach((p) => {
      nextP[p.id] = true;
      p.themes.forEach((t) => (nextT[t.id] = true));
    });
    setOpenPillars(nextP);
    setOpenThemes(nextT);
  };
  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // add/remove
  const onAddPillar = () => setPillars((prev) => addPillar(prev));
  const onAddTheme = (pillarId: string) =>
    setPillars((prev) => addTheme(prev, pillarId));
  const onAddSubtheme = (pillarId: string, themeId: string) =>
    setPillars((prev) => addSubtheme(prev, pillarId, themeId));

  const onDeletePillar = (pillarId: string) =>
    setPillars((prev) => removePillar(prev, pillarId));
  const onDeleteTheme = (pillarId: string, themeId: string) =>
    setPillars((prev) => removeTheme(prev, pillarId, themeId));
  const onDeleteSubtheme = (
    pillarId: string,
    themeId: string,
    subId: string
  ) => setPillars((prev) => removeSubtheme(prev, pillarId, themeId, subId));

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <Button size="sm" variant="outline" onClick={onAddPillar}>
              <Plus className="w-4 h-4 mr-1" /> Add Pillar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMode((s) => !s)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            {editMode ? "Editing" : "View Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th className="w-60">Type / Ref Code</th>
              <th className="min-w-[18rem]">Name / Description</th>
              <th className="w-20 text-center">Sort</th>
              <th className="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pillars.map((pillar) => {
              const pillarOpen = !!openPillars[pillar.id];
              return (
                <>
                  {/* Pillar row */}
                  <tr key={pillar.id} className="[&>td]:px-3 [&>td]:py-2">
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePillar(pillar.id)}>
                          {pillarOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <Badge>Pillar</Badge>
                        <span className="text-xs text-gray-500">
                          {pillar.ref_code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{pillar.name}</div>
                      {pillar.description && (
                        <div className="text-xs text-gray-600">
                          {pillar.description}
                        </div>
                      )}
                    </td>
                    <td className="text-center">{pillar.sort_order}</td>
                    <td className="text-center">
                      {editMode && (
                        <div className="flex gap-3 justify-center">
                          <Plus
                            className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800"
                            title="Add Theme"
                            onClick={() => onAddTheme(pillar.id)}
                          />
                          <Trash2
                            className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800"
                            title="Delete Pillar"
                            onClick={() => onDeletePillar(pillar.id)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Themes */}
                  {pillarOpen &&
                    pillar.themes.map((theme) => {
                      const themeOpen = !!openThemes[theme.id];
                      return (
                        <>
                          <tr
                            key={theme.id}
                            className="[&>td]:px-3 [&>td]:py-2"
                          >
                            <td>
                              <div className="flex items-center gap-2 pl-4">
                                <button onClick={() => toggleTheme(theme.id)}>
                                  {themeOpen ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                <Badge variant="success">Theme</Badge>
                                <span className="text-xs text-gray-500">
                                  {theme.ref_code}
                                </span>
                              </div>
                            </td>
                            <td className="pl-4">
                              <div className="font-medium">{theme.name}</div>
                              {theme.description && (
                                <div className="text-xs text-gray-600">
                                  {theme.description}
                                </div>
                              )}
                            </td>
                            <td className="text-center">{theme.sort_order}</td>
                            <td className="text-center">
                              {editMode && (
                                <div className="flex gap-3 justify-center">
                                  <Plus
                                    className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800"
                                    title="Add Subtheme"
                                    onClick={() =>
                                      onAddSubtheme(pillar.id, theme.id)
                                    }
                                  />
                                  <Trash2
                                    className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800"
                                    title="Delete Theme"
                                    onClick={() =>
                                      onDeleteTheme(pillar.id, theme.id)
                                    }
                                  />
                                </div>
                              )}
                            </td>
                          </tr>

                          {/* Subthemes */}
                          {themeOpen &&
                            theme.subthemes.map((sub) => (
                              <tr
                                key={sub.id}
                                className="[&>td]:px-3 [&>td]:py-2"
                              >
                                <td>
                                  <div className="flex items-center gap-2 pl-8">
                                    <Badge variant="danger">Subtheme</Badge>
                                    <span className="text-xs text-gray-500">
                                      {sub.ref_code}
                                    </span>
                                  </div>
                                </td>
                                <td className="pl-8">
                                  <div className="font-medium">{sub.name}</div>
                                  {sub.description && (
                                    <div className="text-xs text-gray-600">
                                      {sub.description}
                                    </div>
                                  )}
                                </td>
                                <td className="text-center">
                                  {sub.sort_order}
                                </td>
                                <td className="text-center">
                                  {editMode && (
                                    <Trash2
                                      className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800"
                                      title="Delete Subtheme"
                                      onClick={() =>
                                        onDeleteSubtheme(
                                          pillar.id,
                                          theme.id,
                                          sub.id
                                        )
                                      }
                                    />
                                  )}
                                </td>
                              </tr>
                            ))}
                        </>
                      );
                    })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
