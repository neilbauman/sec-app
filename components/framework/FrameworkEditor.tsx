// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
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
import { getFrameworkClient } from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

// Reusable inline editable cell
function EditableCell({
  value,
  placeholder,
  onChange,
  className = "",
}: {
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleBlur = async () => {
    setEditing(false);
    if (temp !== value) {
      onChange(temp);
    }
  };

  return editing ? (
    <input
      className={`border rounded px-1 text-sm w-full ${className}`}
      value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span
      className={`cursor-pointer ${value ? "" : "text-gray-400 italic"} ${className}`}
      onClick={() => setEditing(true)}
    >
      {value || placeholder}
    </span>
  );
}

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const supabase = getFrameworkClient();

  // -------------------
  // Add / Remove Actions
  // -------------------
  const onAddPillar = async () => {
    const updated = addPillar(pillars);
    setPillars(updated);
    await supabase.from("pillars").insert({
      id: updated[updated.length - 1].id,
      ref_code: updated[updated.length - 1].ref_code,
      name: updated[updated.length - 1].name,
      description: updated[updated.length - 1].description,
      sort_order: updated[updated.length - 1].sort_order,
    });
  };

  const onAddTheme = async (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    setPillars(updated);
    const pillar = updated.find((p) => p.id === pillarId)!;
    const theme = pillar.themes[pillar.themes.length - 1];
    await supabase.from("themes").insert(theme);
  };

  const onAddSubtheme = async (pillarId: string, themeId: string) => {
    const updated = addSubtheme(pillars, pillarId, themeId);
    setPillars(updated);
    const pillar = updated.find((p) => p.id === pillarId)!;
    const theme = pillar.themes.find((t) => t.id === themeId)!;
    const sub = theme.subthemes[theme.subthemes.length - 1];
    await supabase.from("subthemes").insert(sub);
  };

  const onRemovePillar = async (pillarId: string) => {
    setPillars(removePillar(pillars, pillarId));
    await supabase.from("pillars").delete().eq("id", pillarId);
  };

  const onRemoveTheme = async (pillarId: string, themeId: string) => {
    setPillars(removeTheme(pillars, pillarId, themeId));
    await supabase.from("themes").delete().eq("id", themeId);
  };

  const onRemoveSubtheme = async (
    pillarId: string,
    themeId: string,
    subId: string
  ) => {
    setPillars(removeSubtheme(pillars, pillarId, themeId, subId));
    await supabase.from("subthemes").delete().eq("id", subId);
  };

  // -------------------
  // Inline Edit Handler
  // -------------------
  const onUpdateField = async (
    table: "pillars" | "themes" | "subthemes",
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    // Update local state
    setPillars((prev) =>
      prev.map((p) => {
        if (table === "pillars" && p.id === id) {
          return { ...p, [field]: value };
        }
        if (table === "themes") {
          return {
            ...p,
            themes: p.themes.map((t) =>
              t.id === id ? { ...t, [field]: value } : t
            ),
          };
        }
        if (table === "subthemes") {
          return {
            ...p,
            themes: p.themes.map((t) => ({
              ...t,
              subthemes: t.subthemes.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
              ),
            })),
          };
        }
        return p;
      })
    );

    // Save directly to Supabase
    await supabase.from(table).update({ [field]: value }).eq("id", id);
  };

  // -------------------
  // Row Components
  // -------------------
  const SubthemeRow = (s: NormalizedSubtheme, pillarId: string, themeId: string) => (
    <tr key={s.id} className="border-b">
      <td className="px-4 py-2 pl-16">
        <Badge variant="danger">Subtheme</Badge>
      </td>
      <td className="px-4 py-2">
        <EditableCell
          value={s.name}
          placeholder="Subtheme name"
          onChange={(val) => onUpdateField("subthemes", s.id, "name", val)}
        />
        <div className="text-xs text-gray-500">
          <EditableCell
            value={s.description}
            placeholder="Description"
            onChange={(val) => onUpdateField("subthemes", s.id, "description", val)}
          />
        </div>
      </td>
      <td className="px-4 py-2 text-xs text-gray-500">{s.ref_code}</td>
      <td className="px-4 py-2"></td>
      <td className="px-4 py-2 flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => onRemoveSubtheme(pillarId, themeId, s.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );

  const ThemeRow = (t: NormalizedTheme, pillarId: string) => (
    <>
      <tr key={t.id} className="border-b">
        <td className="px-4 py-2 pl-12">
          <button
            onClick={() =>
              setOpenThemes((s) => ({ ...s, [t.id]: !s[t.id] }))
            }
          >
            {openThemes[t.id] ? (
              <ChevronDown className="w-4 h-4 inline mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 inline mr-1" />
            )}
          </button>
          <Badge variant="success">Theme</Badge>
        </td>
        <td className="px-4 py-2">
          <EditableCell
            value={t.name}
            placeholder="Theme name"
            onChange={(val) => onUpdateField("themes", t.id, "name", val)}
          />
          <div className="text-xs text-gray-500">
            <EditableCell
              value={t.description}
              placeholder="Description"
              onChange={(val) => onUpdateField("themes", t.id, "description", val)}
            />
          </div>
        </td>
        <td className="px-4 py-2 text-xs text-gray-500">{t.ref_code}</td>
        <td className="px-4 py-2"></td>
        <td className="px-4 py-2 flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onAddSubtheme(pillarId, t.id)}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRemoveTheme(pillarId, t.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </td>
      </tr>
      {openThemes[t.id] && t.subthemes.map((s) => SubthemeRow(s, pillarId, t.id))}
    </>
  );

  const PillarRow = (p: NormalizedPillar) => (
    <>
      <tr key={p.id} className="border-b bg-gray-50">
        <td className="px-4 py-2">
          <button
            onClick={() =>
              setOpenPillars((s) => ({ ...s, [p.id]: !s[p.id] }))
            }
          >
            {openPillars[p.id] ? (
              <ChevronDown className="w-4 h-4 inline mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 inline mr-1" />
            )}
          </button>
          <Badge>Pillar</Badge>
        </td>
        <td className="px-4 py-2">
          <EditableCell
            value={p.name}
            placeholder="Pillar name"
            onChange={(val) => onUpdateField("pillars", p.id, "name", val)}
          />
          <div className="text-xs text-gray-500">
            <EditableCell
              value={p.description}
              placeholder="Description"
              onChange={(val) => onUpdateField("pillars", p.id, "description", val)}
            />
          </div>
        </td>
        <td className="px-4 py-2 text-xs text-gray-500">{p.ref_code}</td>
        <td className="px-4 py-2"></td>
        <td className="px-4 py-2 flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onAddTheme(p.id)}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRemovePillar(p.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </td>
      </tr>
      {openPillars[p.id] && p.themes.map((t) => ThemeRow(t, p.id))}
    </>
  );

  // -------------------
  // Render
  // -------------------
  return (
    <div>
      <div className="flex justify-end mb-4 gap-2">
        <Button size="sm" variant="outline" onClick={onAddPillar}>
          + Add Pillar
        </Button>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-40">Type</th>
            <th className="px-4 py-2">Name / Description</th>
            <th className="px-4 py-2 w-32">Ref Code</th>
            <th className="px-4 py-2 w-24">Sort</th>
            <th className="px-4 py-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>{pillars.map((p) => PillarRow(p))}</tbody>
      </table>
    </div>
  );
}
