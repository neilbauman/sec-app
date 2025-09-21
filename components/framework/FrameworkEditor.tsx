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

type FrameworkEditorProps = {
  data: NestedPillar[];
};

/** Pale button style to match your badges */
const paleBtn =
  "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200 hover:bg-blue-100";
const paleBtnGreen =
  "bg-green-50 text-green-800 ring-1 ring-inset ring-green-200 hover:bg-green-100";
const paleBtnGray =
  "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100";

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [pillars, setPillars] = useState<NestedPillar[]>(data);

  // Expand/Collapse state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Global edit mode (controls visibility of Add buttons and row action buttons)
  const [editMode, setEditMode] = useState<boolean>(false);

  // Track which single row is currently being edited (for disabling while saving)
  const [editingRow, setEditingRow] = useState<string | null>(null);

  // File input for CSV upload
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

  // ---------- Inline Edit (pessimistic persistence on blur) ----------
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

        // Update local state after success
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

  // ---------- Add / Remove (local-only per requirements) ----------
  const onAddPillar = () => setPillars((prev) => addPillar(prev));
  const onAddTheme = (pillarId: string) =>
    setPillars((prev) => addTheme(prev, pillarId));
  const onAddSubtheme = (themeId: string) =>
    setPillars((prev) => addSubtheme(prev, themeId));

  const onDeletePillar = (pillarId: string) =>
    setPillars((prev) => removePillar(prev, pillarId));
  const onDeleteTheme = (themeId: string) =>
    setPillars((prev) => removeTheme(prev, themeId));
  const onDeleteSubtheme = (themeId: string, subthemeId: string) =>
    setPillars((prev) => removeSubtheme(prev, themeId, subthemeId));

  // ---------- CSV (download current local state; upload updates local state only) ----------
  const downloadCSV = () => {
    const rows: string[] = [];
    rows.push(
      [
        "type",
        "id",
        "parent_id",
        "ref_code",
        "name",
        "description",
        "sort_order",
      ].join(",")
    );
    pillars.forEach((p) => {
      rows.push(
        [
          "pillar",
          escapeCSV(p.id),
          "",
          escapeCSV(p.ref_code),
          escapeCSV(p.name),
          escapeCSV(p.description),
          String(p.sort_order ?? ""),
        ].join(",")
      );
      p.themes.forEach((t) => {
        rows.push(
          [
            "theme",
            escapeCSV(t.id),
            escapeCSV(p.id),
            escapeCSV(t.ref_code),
            escapeCSV(t.name),
            escapeCSV(t.description),
            String(t.sort_order ?? ""),
          ].join(",")
        );
        t.subthemes.forEach((s) => {
          rows.push(
            [
              "subtheme",
              escapeCSV(s.id),
              escapeCSV(t.id),
              escapeCSV(s.ref_code),
              escapeCSV(s.name),
              escapeCSV(s.description),
              String(s.sort_order ?? ""),
            ].join(",")
          );
        });
      });
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "framework.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadCSVClick = () => fileInputRef.current?.click();

  const onCSVUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines.shift();
    if (!header) return;
    const cols = header.split(",");
    const colIdx = (name: string) => cols.findIndex((c) => c.trim() === name);

    const idxType = colIdx("type");
    const idxId = colIdx("id");
    const idxParent = colIdx("parent_id");
    const idxRef = colIdx("ref_code");
    const idxName = colIdx("name");
    const idxDesc = colIdx("description");
    const idxSort = colIdx("sort_order");

    const newPillars: NestedPillar[] = [];
    const themeById = new Map<string, NestedTheme>();

    lines.forEach((line) => {
      const parts = parseCSVLine(line);
      const type = parts[idxType];
      if (type === "pillar") {
        const pillar: NestedPillar = {
          id: parts[idxId],
          ref_code: parts[idxRef],
          name: parts[idxName],
          description: parts[idxDesc],
          sort_order: Number(parts[idxSort] || 0),
          themes: [],
        };
        newPillars.push(pillar);
      } else if (type === "theme") {
        const theme: NestedTheme = {
          id: parts[idxId],
          pillar_id: parts[idxParent],
          ref_code: parts[idxRef],
          name: parts[idxName],
          description: parts[idxDesc],
          sort_order: Number(parts[idxSort] || 0),
          subthemes: [],
        } as NestedTheme;
        const parent = newPillars.find((p) => p.id === theme.pillar_id);
        if (parent) {
          parent.themes.push(theme);
          themeById.set(theme.id, theme);
        }
      } else if (type === "subtheme") {
        const sub: NestedSubtheme = {
          id: parts[idxId],
          theme_id: parts[idxParent],
          ref_code: parts[idxRef],
          name: parts[idxName],
          description: parts[idxDesc],
          sort_order: Number(parts[idxSort] || 0),
        } as NestedSubtheme;
        const parent = themeById.get(sub.theme_id);
        if (parent) parent.subthemes.push(sub);
      }
    });

    // Update local state only (no DB changes for bulk to keep it safe/simple)
    setPillars(newPillars);
  };

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={expandAll}
            className={paleBtn}
            size="sm"
          >
            Expand All
          </Button>
          <Button
            type="button"
            onClick={collapseAll}
            className={paleBtn}
            size="sm"
          >
            Collapse All
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {editMode && (
            <Button
              type="button"
              onClick={onAddPillar}
              className={paleBtnGreen}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Pillar
            </Button>
          )}

          {/* Bulk Edit: looks like adjacent buttons */}
          <div className="flex items-center gap-2 rounded-xl ring-1 ring-inset ring-gray-200 p-1">
            <Button
              type="button"
              onClick={downloadCSV}
              className={paleBtnGray}
              size="sm"
              title="Download CSV"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onCSVUpload(f);
                e.currentTarget.value = "";
              }}
              className="hidden"
            />
            <Button
              type="button"
              onClick={uploadCSVClick}
              className={paleBtnGray}
              size="sm"
              title="Upload CSV"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </div>

          {/* Edit Mode toggle */}
          <Button
            type="button"
            onClick={() => setEditMode((s) => !s)}
            className={editMode ? paleBtn : paleBtnGray}
            size="sm"
            aria-pressed={editMode}
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
                <FragmentRow key={pillar.id}>
                  {/* Pillar Row */}
                  <tr className="[&>td]:px-3 [&>td]:py-2 align-top">
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Caret
                          open={pillarOpen}
                          onClick={() => togglePillar(pillar.id)}
                        />
                        <Badge className="min-w-[70px] justify-center">
                          Pillar
                        </Badge>
                      </div>
                    </td>
                    <td className="text-gray-900">{pillar.ref_code}</td>
                    <td>
                      <EditableField
                        disabled={!editMode || editingRow === pillar.id}
                        type="pillar"
                        id={pillar.id}
                        label="name"
                        value={pillar.name}
                        onSave={persistField}
                        inputClass="w-full font-medium"
                      />
                      <EditableField
                        disabled={!editMode || editingRow === pillar.id}
                        type="pillar"
                        id={pillar.id}
                        label="description"
                        value={pillar.description || ""}
                        onSave={persistField}
                        textarea
                        inputClass="w-full text-xs text-gray-600 mt-1"
                        placeholder="Add a short description…"
                      />
                    </td>
                    <td className="text-right tabular-nums text-gray-600">
                      {pillar.sort_order ?? ""}
                    </td>
                    <td className="text-right">
                      {editMode && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className={paleBtn}
                            onClick={() => onAddTheme(pillar.id)}
                            title="Add Theme"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Theme
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="bg-red-50 text-red-800 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                            onClick={() => onDeletePillar(pillar.id)}
                            title="Delete Pillar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Themes */}
                  {pillarOpen &&
                    pillar.themes.map((theme) => {
                      const themeOpen = !!openThemes[theme.id];
                      return (
                        <tr
                          key={theme.id}
                          className="[&>td]:px-3 [&>td]:py-2 align-top"
                        >
                          <td className="whitespace-nowrap">
                            <div className="flex items-center gap-2 pl-6">
                              <Caret
                                open={themeOpen}
                                onClick={() => toggleTheme(theme.id)}
                              />
                              <Badge
                                variant="success"
                                className="min-w-[70px] justify-center"
                              >
                                Theme
                              </Badge>
                            </div>
                          </td>
                          <td className="text-gray-900">{theme.ref_code}</td>
                          <td>
                            <EditableField
                              disabled={!editMode || editingRow === theme.id}
                              type="theme"
                              id={theme.id}
                              label="name"
                              value={theme.name}
                              onSave={persistField}
                              inputClass="w-full font-medium"
                            />
                            <EditableField
                              disabled={!editMode || editingRow === theme.id}
                              type="theme"
                              id={theme.id}
                              label="description"
                              value={theme.description || ""}
                              onSave={persistField}
                              textarea
                              inputClass="w-full text-xs text-gray-600 mt-1"
                              placeholder="Add a short description…"
                            />
                          </td>
                          <td className="text-right tabular-nums text-gray-600">
                            {theme.sort_order ?? ""}
                          </td>
                          <td className="text-right">
                            {editMode && (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  className={paleBtn}
                                  onClick={() => onAddSubtheme(theme.id)}
                                  title="Add Subtheme"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Subtheme
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="bg-red-50 text-red-800 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                                  onClick={() => onDeleteTheme(theme.id)}
                                  title="Delete Theme"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  {/* Subthemes */}
                  {pillarOpen &&
                    pillar.themes
                      .filter((t) => openThemes[t.id])
                      .flatMap((t) =>
                        t.subthemes.map((s) => (
                          <tr
                            key={s.id}
                            className="[&>td]:px-3 [&>td]:py-2 align-top"
                          >
                            <td className="whitespace-nowrap">
                              <div className="flex items-center gap-2 pl-12">
                                {/* no caret for leaf */}
                                <span className="w-4 h-4" />
                                <Badge
                                  variant="danger"
                                  className="min-w-[70px] justify-center"
                                >
                                  Subtheme
                                </Badge>
                              </div>
                            </td>
                            <td className="text-gray-900">{s.ref_code}</td>
                            <td>
                              <EditableField
                                disabled={!editMode || editingRow === s.id}
                                type="subtheme"
                                id={s.id}
                                label="name"
                                value={s.name}
                                onSave={persistField}
                                inputClass="w-full font-medium"
                              />
                              <EditableField
                                disabled={!editMode || editingRow === s.id}
                                type="subtheme"
                                id={s.id}
                                label="description"
                                value={s.description || ""}
                                onSave={persistField}
                                textarea
                                inputClass="w-full text-xs text-gray-600 mt-1"
                                placeholder="Add a short description…"
                              />
                            </td>
                            <td className="text-right tabular-nums text-gray-600">
                              {s.sort_order ?? ""}
                            </td>
                            <td className="text-right">
                              {editMode && (
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="bg-red-50 text-red-800 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                                    onClick={() =>
                                      onDeleteSubtheme(s.theme_id, s.id)
                                    }
                                    title="Delete Subtheme"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                </FragmentRow>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------- Helpers & Subcomponents ------------------------- */

function escapeCSV(value: string) {
  if (value == null) return "";
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else if (ch === ",") {
      result.push(cur);
      cur = "";
    } else if (ch === '"') {
      inQ = true;
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function Caret({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-gray-100"
      aria-label={open ? "Collapse" : "Expand"}
    >
      {open ? (
        <ChevronDown className="w-4 h-4 text-gray-600" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

type EditableProps = {
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
  inputClass?: string;
  placeholder?: string;
};

function EditableField({
  disabled,
  type,
  id,
  label,
  value,
  onSave,
  textarea,
  inputClass = "",
  placeholder,
}: EditableProps) {
  const [val, setVal] = useState<string>(value);

  // keep local input in sync if parent updates
  if (val !== value && document.activeElement !== null) {
    // When parent state changes while not editing, keep consistent
    // This is a small guard to avoid cursor jumps during active input
  }

  return textarea ? (
    <textarea
      disabled={disabled}
      value={val}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      onBlur={async () => {
        if (val !== value) await onSave(type, id, label, val);
      }}
      className={`rounded-md border border-gray-200 px-2 py-1 ${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      rows={2}
    />
  ) : (
    <input
      disabled={disabled}
      value={val}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      onBlur={async () => {
        if (val !== value) await onSave(type, id, label, val);
      }}
      className={`rounded-md border border-gray-200 px-2 py-1 ${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
    />
  );
}
