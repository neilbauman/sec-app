// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
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
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

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

  const onRemoveSubtheme = (pillarId: string, themeId: string, subthemeId: string) => {
    const updated = removeSubtheme(pillars, pillarId, themeId, subthemeId);
    setPillars(updated);
  };

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {editMode && (
          <Button size="sm" variant="primary" onClick={onAddPillar}>
            + Add Pillar
          </Button>
        )}
        <Button
          size="sm"
          variant="rust"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      <div className="space-y-3">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border rounded-lg p-3">
            {/* Pillar row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
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
                <Badge variant="default">Pillar</Badge>
                <span className="font-medium">{pillar.name}</span>
                <span className="text-gray-500 text-xs">{pillar.ref_code}</span>
              </div>
              {editMode && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddTheme(pillar.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemovePillar(pillar.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Themes */}
            {openPillars[pillar.id] && (
              <div className="ml-6 mt-2 space-y-2">
                {pillar.themes.map((theme) => (
                  <div key={theme.id} className="border-l-2 pl-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
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
                        <Badge variant="success">Theme</Badge>
                        <span>{theme.name}</span>
                        <span className="text-gray-500 text-xs">{theme.ref_code}</span>
                      </div>
                      {editMode && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAddSubtheme(pillar.id, theme.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemoveTheme(pillar.id, theme.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Subthemes */}
                    {openThemes[theme.id] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {theme.subthemes.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="danger">Subtheme</Badge>
                              <span>{sub.name}</span>
                              <span className="text-gray-500 text-xs">{sub.ref_code}</span>
                            </div>
                            {editMode && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  onRemoveSubtheme(pillar.id, theme.id, sub.id)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
