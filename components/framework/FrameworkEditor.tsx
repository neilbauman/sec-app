// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
  movePillar,
  moveTheme,
  moveSubtheme,
  saveFramework,
} from "@/lib/framework-actions";
import { buildRefCodeMap, RefMeta, cloneFramework } from "@/lib/framework-utils";
import type { NestedPillar } from "@/lib/framework-client";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, Save, X, ChevronRight, ChevronDown } from "lucide-react";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialPillars);
  const [refMap, setRefMap] = useState<Record<string, RefMeta>>(() =>
    buildRefCodeMap(initialPillars)
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const markDirty = (updated: NestedPillar[]) => {
    setPillars(updated);
    setRefMap(buildRefCodeMap(updated, refMap));
    setDirty(true);
  };

  // ---------- Handlers ----------
  const handleSave = async () => {
    await saveFramework(pillars);
    setRefMap(buildRefCodeMap(pillars)); // reset dirty
    setDirty(false);
  };

  const handleCancel = () => {
    setPillars(cloneFramework(initialPillars));
    setRefMap(buildRefCodeMap(initialPillars));
    setDirty(false);
  };

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {dirty && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md">
          <span>Items in red will be regenerated on save.</span>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-md"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-1">Type / Ref</th>
            <th className="px-2 py-1">Name & Description</th>
            <th className="px-2 py-1 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
            <Row
              key={pillar.id}
              node={pillar}
              refMap={refMap}
              expanded={expanded}
              setExpanded={setExpanded}
              onChange={markDirty}
              setEditing={setEditing}
              editing={editing}
              type="pillar"
              parentId={null}
              pillars={pillars}
            />
          ))}
        </tbody>
      </table>

      <button
        onClick={() => markDirty(addPillar(pillars))}
        className="flex items-center gap-1 text-blue-600 text-sm mt-2"
      >
        <Plus size={14} /> Add Pillar
      </button>
    </div>
  );
}

// ---------- Row Component ----------
type RowProps = {
  node: any;
  refMap: Record<string, RefMeta>;
  expanded: Record<string, boolean>;
  setExpanded: (e: Record<string, boolean>) => void;
  onChange: (p: NestedPillar[]) => void;
  setEditing: (id: string | null) => void;
  editing: string | null;
  type: "pillar" | "theme" | "subtheme";
  parentId: string | null;
  pillars: NestedPillar[];
};

function Row({
  node,
  refMap,
  expanded,
  setExpanded,
  onChange,
  setEditing,
  editing,
  type,
  parentId,
  pillars,
}: RowProps) {
  const ref = refMap[node.id];

  const toggle = () =>
    setExpanded({ ...expanded, [node.id]: !expanded[node.id] });

  const isEditing = editing === node.id;

  return (
    <>
      <tr>
        <td className="px-2 py-1 align-top">
          <div className="flex items-center gap-1">
            {type !== "subtheme" && (
              <button onClick={toggle} className="text-gray-500">
                {expanded[node.id] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
            <span className="text-xs font-medium text-gray-600">{type}</span>
            <span
              className={ref?.dirty ? "text-red-500 text-xs" : "text-gray-400 text-xs"}
            >
              {ref?.code}
            </span>
          </div>
        </td>
        <td className="px-2 py-1">
          {isEditing ? (
            <input
              type="text"
              defaultValue={node.name}
              onBlur={(e) => {
                node.name = e.target.value;
                setEditing(null);
              }}
              className="border px-1 text-sm w-full"
            />
          ) : (
            <div>
              <div className="font-medium">{node.name}</div>
              {node.description && (
                <div className="text-xs text-gray-500">{node.description}</div>
              )}
            </div>
          )}
        </td>
        <td className="px-2 py-1">
          <div className="flex gap-2">
            <button onClick={() => setEditing(node.id)}><Pencil size={14} /></button>
            <button><Trash2 size={14} /></button>
            <button><ArrowUp size={14} /></button>
            <button><ArrowDown size={14} /></button>
            {type !== "subtheme" && <button><Plus size={14} /></button>}
          </div>
        </td>
      </tr>
      {/* Expand children */}
      {expanded[node.id] && type === "pillar" &&
        node.themes.map((t: NestedTheme) => (
          <Row
            key={t.id}
            node={t}
            refMap={refMap}
            expanded={expanded}
            setExpanded={setExpanded}
            onChange={onChange}
            setEditing={setEditing}
            editing={editing}
            type="theme"
            parentId={node.id}
            pillars={pillars}
          />
        ))}
      {expanded[node.id] && type === "theme" &&
        node.subthemes.map((s: NestedSubtheme) => (
          <Row
            key={s.id}
            node={s}
            refMap={refMap}
            expanded={expanded}
            setExpanded={setExpanded}
            onChange={onChange}
            setEditing={setEditing}
            editing={editing}
            type="subtheme"
            parentId={node.id}
            pillars={pillars}
          />
        ))}
    </>
  );
}
