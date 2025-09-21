// components/framework/FrameworkEditor.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

/** Pale button styles matching badges */
const paleBtn =
  "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200 hover:bg-blue-100";
const paleBtnGreen =
  "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200 hover:bg-green-100";
const paleBtnGray =
  "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [pillars, setPillars] = useState<NestedPillar[]>(data);

  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- Expand / Collapse ----------
  const togglePillar = (id: string) =>
    setOpenPillars((s) => ({ ...s, [id]: !s[id] }));
  const toggleTheme = (id: string) =>
    setOpenThemes((s) => ({ ...s, [id]: !s[id] }));

  const expandAll = () => {
    const nextP: Record<string, boolean> = {};
    const nextT: Record<string, boolean> = {};
    pillars.forEach((p) => {
      nextP[p.id] = true;
      p.themes.forEach((t) => {
        nextT[t.id] = true;
      });
    });
    setOpenPillars(nextP);
    setOpenThemes(nextT);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---------- Inline Edit persistence ----------
  async function persistField(
    type: "pillar" | "theme" | "subtheme",
    id: string,
    field: "name" | "description",
    value: string
  ) {
    setEditingRow(id);
    try {
      if (type === "pillar") {
        const { error } = await supabase
          .from("pillars")
          .update({ [field]: value })
          .eq("id", id);
        if (error) throw error;
        setPillars((prev) =>
          prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
      } else if (type === "theme") {
        const { error } = await supabase
          .from("themes")
          .update({ [field]: value })
          .eq("id", id);
        if (error) throw error;
        setPillars((prev) =>
          prev.map((p) => ({
            ...p,
            themes: p.themes.map((t) =>
              t.id === id ? { ...t, [field]: value } : t
            ),
          }))
        );
      } else {
        const { error } = await supabase
          .from("subthemes")
          .update({ [field]: value })
          .eq("id", id);
        if (error) throw error;
        setPillars((prev) =>
          prev.map((p) => ({
            ...p,
            themes: p.themes.map((t) => ({
              ...t,
              subthemes: t.subthemes.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
              ),
            })),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to save field:", err);
      alert("Error saving changes.");
    } finally {
      setEditingRow(null);
    }
  }

  // ---------- Add / Remove ----------
  const onAddPillar = () => setPillars((prev) => addPillar(prev));
  const onAddTheme = (pillarId: string) =>
    setPillars((prev) => addTheme(prev, pillarId));
  const onAddSubtheme = (pillarId: string, themeId: string) =>
    setPillars((prev) => addSubtheme(prev, pillarId, themeId));

  const onDeletePillar = (pillarId: string) =>
    setPillars((prev) => removePillar(prev, pillarId));
  const onDeleteTheme = (pillarId: string, themeId: string) =>
    setPillars((prev) => removeTheme(prev, pillarId, themeId));
  const onDeleteSubtheme = (pillarId: string, themeId: string, subId: string) =>
    setPillars((prev) => removeSubtheme(prev, pillarId, themeId, subId));

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={expandAll} className={paleBtn} size="sm">
            Expand All
          </Button>
          <Button onClick={collapseAll} className={paleBtn} size="sm">
            Collapse All
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <Button onClick={onAddPillar} className={paleBtnGreen} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Pillar
            </Button>
          )}
          <Button
            onClick={() => setEditMode((s) => !s)}
            className={editMode ? paleBtn : paleBtnGray}
            size="sm"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            {editMode ? "Editing" : "View Mode"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th className="w-40">Type</th>
              <th className="w-24">Ref Code</th>
              <th className="min-w-[18rem]">Name / Description</th>
              <th className="w-24 text-right">Sort</th>
              <th className="w-56 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pillars.map((pillar) => {
              const pillarOpen = !!openPillars[pillar.id];
              return (
                <>
                  <tr key={pillar.id} className="[&>td]:px-3 [&>td]:py-2">
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePillar(pillar.id)}
                          className="w-5 h-5"
                        >
                          {pillarOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <Badge>Pillar</Badge>
                      </div>
                    </td>
                    <td>{pillar.ref_code}</td>
                    <td>
                      <EditableField
                        disabled={!editMode || editingRow === pillar.id}
                        type="pillar"
                        id={pillar.id}
                        label="name"
                        value={pillar.name}
                        onSave={persistField}
                      />
                      <EditableField
                        disabled={!editMode || editingRow === pillar.id}
                        type="pillar"
                        id={pillar.id}
                        label="description"
                        value={pillar.description}
                        onSave={persistField}
                        textarea
                      />
                    </td>
                    <td className="text-right">{pillar.sort_order}</td>
                    <td className="text-right">
                      {editMode && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            className={paleBtn}
                            onClick={() => onAddTheme(pillar.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Theme
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-50 text-red-800 ring-1 ring-inset ring-red-200"
                            onClick={() => onDeletePillar(pillar.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {pillarOpen &&
                    pillar.themes.map((theme) => {
                      const themeOpen = !!openThemes[theme.id];
                      return (
                        <tr key={theme.id} className="[&>td]:px-3 [&>td]:py-2">
                          <td>
                            <div className="flex items-center gap-2 pl-6">
                              <button
                                onClick={() => toggleTheme(theme.id)}
                                className="w-5 h-5"
                              >
                                {themeOpen ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <Badge variant="success">Theme</Badge>
                            </div>
                          </td>
                          <td>{theme.ref_code}</td>
                          <td>
                            <EditableField
                              disabled={!editMode || editingRow === theme.id}
                              type="theme"
                              id={theme.id}
                              label="name"
                              value={theme.name}
                              onSave={persistField}
                            />
                            <EditableField
                              disabled={!editMode || editingRow === theme.id}
                              type="theme"
                              id={theme.id}
                              label="description"
                              value={theme.description}
                              onSave={persistField}
                              textarea
                            />
                          </td>
                          <td className="text-right">{theme.sort_order}</td>
                          <td className="text-right">
                            {editMode && (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  className={paleBtn}
                                  onClick={() =>
                                    onAddSubtheme(pillar.id, theme.id)
                                  }
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Subtheme
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-50 text-red-800 ring-1 ring-inset ring-red-200"
                                  onClick={() => onDeleteTheme(pillar.id, theme.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
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

/* -------- EditableField subcomponent -------- */
function EditableField({
  disabled,
  type,
  id,
  label,
  value,
  onSave,
  textarea,
}: {
  disabled?: boolean;
  type: "pillar" | "theme" | "subtheme";
  id: string;
  label: "name" | "description";
  value: string;
  onSave: (
    type: "pillar" | "theme" | "subtheme",
    id: string,
    field: "name" | "description",
    value: string
  ) => Promise<void>;
  textarea?: boolean;
}) {
  const [val, setVal] = useState(value);
  return textarea ? (
    <textarea
      disabled={disabled}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => {
        if (val !== value) onSave(type, id, label, val);
      }}
      className="w-full text-xs text-gray-600 border rounded px-2 py-1"
    />
  ) : (
    <input
      disabled={disabled}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => {
        if (val !== value) onSave(type, id, label, val);
      }}
      className="w-full border rounded px-2 py-1"
    />
  );
}
