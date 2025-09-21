// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Pencil } from "lucide-react";
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

  // ---------- Action handlers ----------
  const onAddPillar = () => setPillars(addPillar(pillars));
  const onRemovePillar = (id: string) => setPillars(removePillar(pillars, id));
  const onAddTheme = (pillarId: string) =>
    setPillars(addTheme(pillars, pillarId));
  const onRemoveTheme = (pillarId: string, themeId: string) =>
    setPillars(removeTheme(pillars, pillarId, themeId));
  const onAddSubtheme = (pillarId: string, themeId: string) =>
    setPillars(addSubtheme(pillars, pillarId, themeId));
  const onRemoveSubtheme = (
    pillarId: string,
    themeId: string,
    subthemeId: string
  ) => setPillars(removeSubtheme(pillars, pillarId, themeId, subthemeId));

  // ---------- Inline edit handlers ----------
  const updateName = (
    type: "pillar" | "theme" | "subtheme",
    pillarId: string,
    themeId: string | null,
    subthemeId: string | null,
    newName: string
  ) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? {
              ...p,
              name: type === "pillar" ? newName : p.name,
              themes: p.themes.map((t) =>
                t.id === themeId
                  ? {
                      ...t,
                      name: type === "theme" ? newName : t.name,
                      subthemes: t.subthemes.map((s) =>
                        s.id === subthemeId
                          ? { ...s, name: type === "subtheme" ? newName : s.name }
                          : s
                      ),
                    }
                  : t
              ),
            }
          : p
      )
    );
  };

  const updateDescription = (
    type: "pillar" | "theme" | "subtheme",
    pillarId: string,
    themeId: string | null,
    subthemeId: string | null,
    newDesc: string
  ) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? {
              ...p,
              description: type === "pillar" ? newDesc : p.description,
              themes: p.themes.map((t) =>
                t.id === themeId
                  ? {
                      ...t,
                      description: type === "theme" ? newDesc : t.description,
                      subthemes: t.subthemes.map((s) =>
                        s.id === subthemeId
                          ? {
                              ...s,
                              description: type === "subtheme" ? newDesc : s.description,
                            }
                          : s
                      ),
                    }
                  : t
              ),
            }
          : p
      )
    );
  };

  // ---------- UI helpers ----------
  const renderEditable = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    isTextArea: boolean = false
  ) =>
    editMode ? (
      isTextArea ? (
        <textarea
          className="w-full border rounded px-2 py-1 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full border rounded px-2 py-1 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        />
      )
    ) : (
      <span className="text-sm text-gray-700">{value || <em>({label})</em>}</span>
    );

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-end gap-2">
        {editMode && (
          <Button size="sm" variant="outline" onClick={onAddPillar}>
            + Add Pillar
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      {/* Table */}
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-32 text-left px-2 py-1">Type</th>
            <th className="w-32 text-left px-2 py-1">Ref Code</th>
            <th className="text-left px-2 py-1">Name</th>
            <th className="text-left px-2 py-1">Description</th>
            <th className="w-16 text-center px-2 py-1">Sort</th>
            <th className="w-32 text-center px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              {/* Pillar row */}
              <tr className="border-t">
                <td className="px-2 py-1">
                  <Badge>Pillar</Badge>
                </td>
                <td className="px-2 py-1">{pillar.ref_code}</td>
                <td className="px-2 py-1">
                  {renderEditable("Pillar name", pillar.name, (v) =>
                    updateName("pillar", pillar.id, null, null, v)
                  )}
                </td>
                <td className="px-2 py-1">
                  {renderEditable("Description", pillar.description, (v) =>
                    updateDescription("pillar", pillar.id, null, null, v)
                  , true)}
                </td>
                <td className="px-2 py-1 text-center">{pillar.sort_order}</td>
                <td className="px-2 py-1 text-center space-x-2">
                  {editMode && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAddTheme(pillar.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemovePillar(pillar.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>

              {/* Themes */}
              {pillar.themes.map((theme) => (
                <React.Fragment key={theme.id}>
                  <tr className="border-t bg-gray-50">
                    <td className="px-2 py-1 pl-8">
                      <Badge variant="success">Theme</Badge>
                    </td>
                    <td className="px-2 py-1">{theme.ref_code}</td>
                    <td className="px-2 py-1">
                      {renderEditable("Theme name", theme.name, (v) =>
                        updateName("theme", pillar.id, theme.id, null, v)
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {renderEditable("Description", theme.description, (v) =>
                        updateDescription("theme", pillar.id, theme.id, null, v)
                      , true)}
                    </td>
                    <td className="px-2 py-1 text-center">{theme.sort_order}</td>
                    <td className="px-2 py-1 text-center space-x-2">
                      {editMode && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAddSubtheme(pillar.id, theme.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveTheme(pillar.id, theme.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>

                  {/* Subthemes */}
                  {theme.subthemes.map((sub) => (
                    <tr className="border-t" key={sub.id}>
                      <td className="px-2 py-1 pl-16">
                        <Badge variant="danger">Subtheme</Badge>
                      </td>
                      <td className="px-2 py-1">{sub.ref_code}</td>
                      <td className="px-2 py-1">
                        {renderEditable("Subtheme name", sub.name, (v) =>
                          updateName("subtheme", pillar.id, theme.id, sub.id, v)
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {renderEditable("Description", sub.description, (v) =>
                          updateDescription("subtheme", pillar.id, theme.id, sub.id, v)
                        , true)}
                      </td>
                      <td className="px-2 py-1 text-center">{sub.sort_order}</td>
                      <td className="px-2 py-1 text-center space-x-2">
                        {editMode && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              onRemoveSubtheme(pillar.id, theme.id, sub.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
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
