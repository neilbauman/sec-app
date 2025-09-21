"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
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
import { getSupabaseClient, NestedPillar } from "@/lib/framework-client";

// ---------------- Types ----------------
type FrameworkEditorProps = {
  data: NestedPillar[];
};

// ---------------- Component ----------------
export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const supabase = getSupabaseClient();

  // ---------- DB Update Helper ----------
  async function updateRecord(
    table: "pillars" | "themes" | "subthemes",
    id: string,
    field: string,
    value: string
  ) {
    const { error } = await supabase.from(table).update({ [field]: value }).eq("id", id);
    if (error) console.error("Update failed:", error);
  }

  // ---------- Inline Edit Cell ----------
  function EditableCell({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const handleBlur = () => {
      setEditing(false);
      if (draft !== value) {
        onChange(draft);
      }
    };

    return editing ? (
      <input
        className="border px-1 py-0.5 text-sm w-full"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <span className="cursor-pointer" onClick={() => setEditing(true)}>
        {value || <span className="text-gray-400">Click to edit</span>}
      </span>
    );
  }

  // ---------- Row Component ----------
  function PillarRow({ pillar }: { pillar: NestedPillar }) {
    const isOpen = openPillars[pillar.id] || false;
    return (
      <>
        <tr>
          <td>
            <button
              onClick={() =>
                setOpenPillars((s) => ({ ...s, [pillar.id]: !isOpen }))
              }
            >
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          </td>
          <td>
            <Badge variant="default">Pillar</Badge>
          </td>
          <td>
            <EditableCell
              value={pillar.name}
              onChange={(v) => updateRecord("pillars", pillar.id, "name", v)}
            />
            <div className="text-xs text-gray-500">
              <EditableCell
                value={pillar.description}
                onChange={(v) => updateRecord("pillars", pillar.id, "description", v)}
              />
            </div>
          </td>
          <td>{pillar.ref_code}</td>
          <td>{pillar.sort_order}</td>
          <td className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPillars(removePillar(pillars, pillar.id))}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </td>
        </tr>
        {isOpen &&
          pillar.themes.map((theme) => (
            <tr key={theme.id}>
              <td />
              <td className="pl-6">
                <Badge variant="success">Theme</Badge>
              </td>
              <td>
                <EditableCell
                  value={theme.name}
                  onChange={(v) => updateRecord("themes", theme.id, "name", v)}
                />
                <div className="text-xs text-gray-500">
                  <EditableCell
                    value={theme.description}
                    onChange={(v) => updateRecord("themes", theme.id, "description", v)}
                  />
                </div>
              </td>
              <td>{theme.ref_code}</td>
              <td>{theme.sort_order}</td>
              <td className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setPillars(removeTheme(pillars, pillar.pillar_id, theme.id))
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
      </>
    );
  }

  return (
    <div>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th></th>
            <th>Type</th>
            <th>Name & Description</th>
            <th>Ref Code</th>
            <th>Sort</th>
            <th>Actions</th>
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
