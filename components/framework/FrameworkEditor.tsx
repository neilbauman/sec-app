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
import {
  recalcRefCodes,
  buildRefCodeMap,
  RefMeta,
  cloneFramework,
} from "@/lib/framework-utils";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { v4 as uuidv4 } from "uuid";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
} from "lucide-react";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

type ExpandedState = Record<string, boolean>;

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialPillars);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [dirty, setDirty] = useState(false);

  // Ref code recalculation (pending + saved)
  const refMap: Record<string, RefMeta> = buildRefCodeMap(pillars);

  const markDirty = () => setDirty(true);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    const withRefCodes = recalcRefCodes(cloneFramework(pillars));
    await saveFramework(withRefCodes);
    setPillars(withRefCodes);
    setDirty(false);
  };

  // Generic row renderer
  const Row = ({
    node,
    type,
    parentId,
  }: {
    node: NestedPillar | NestedTheme | NestedSubtheme;
    type: "pillar" | "theme" | "subtheme";
    parentId?: string;
  }) => {
    const refMeta = refMap[node.id];
    const hasChildren =
      type === "pillar"
        ? (node as NestedPillar).themes.length > 0
        : type === "theme"
        ? (node as NestedTheme).subthemes.length > 0
        : false;

    return (
      <>
        <tr className="border-b">
          {/* Expand / Collapse */}
          <td className="py-2 px-2 w-6">
            {hasChildren && (
              <button onClick={() => toggleExpand(node.id)}>
                {expanded[node.id] ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </td>

          {/* Name + Description */}
          <td className="py-2 px-2">
            <div className="font-medium">{node.name}</div>
            {("description" in node && node.description) && (
              <div className="text-sm text-gray-500">{node.description}</div>
            )}
          </td>

          {/* Type + Ref Code */}
          <td className="py-2 px-2">
            <span className="inline-flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {refMeta && (
                <span
                  className={
                    refMeta.dirty ? "text-xs text-red-500" : "text-xs text-gray-400"
                  }
                >
                  {refMeta.code}
                </span>
              )}
            </span>
          </td>

          {/* Actions */}
          <td className="py-2 px-2 flex gap-2">
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                if (type === "pillar") {
                  setPillars(removePillar(pillars, node.id));
                } else if (type === "theme") {
                  setPillars(removeTheme(pillars, parentId!, node.id));
                } else {
                  setPillars(removeSubtheme(pillars, parentId!, node.id));
                }
                markDirty();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (type === "pillar") {
                  setPillars(movePillar(pillars, node.id, "up"));
                } else if (type === "theme") {
                  setPillars(moveTheme(pillars, parentId!, node.id, "up"));
                } else {
                  setPillars(moveSubtheme(pillars, parentId!, node.id, "up"));
                }
                markDirty();
              }}
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => {
                if (type === "pillar") {
                  setPillars(movePillar(pillars, node.id, "down"));
                } else if (type === "theme") {
                  setPillars(moveTheme(pillars, parentId!, node.id, "down"));
                } else {
                  setPillars(moveSubtheme(pillars, parentId!, node.id, "down"));
                }
                markDirty();
              }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {type !== "subtheme" && (
              <button
                onClick={() => {
                  if (type === "pillar") {
                    setPillars(addTheme(pillars, node.id));
                  } else {
                    setPillars(addSubtheme(pillars, node.id));
                  }
                  markDirty();
                }}
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </td>
        </tr>

        {/* Children */}
        {expanded[node.id] &&
          type === "pillar" &&
          (node as NestedPillar).themes.map((t: NestedTheme) => (
            <Row key={t.id} node={t} type="theme" parentId={node.id} />
          ))}
        {expanded[node.id] &&
          type === "theme" &&
          (node as NestedTheme).subthemes.map((s: NestedSubtheme) => (
            <Row key={s.id} node={s} type="subtheme" parentId={node.id} />
          ))}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-2 rounded text-sm flex items-center justify-between">
          <span>Items in red will be regenerated on save.</span>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}

      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2 text-left"></th>
            <th className="py-2 px-2 text-left">Name</th>
            <th className="py-2 px-2 text-left">Type / Ref Code</th>
            <th className="py-2 px-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((p) => (
            <Row key={p.id} node={p} type="pillar" />
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          setPillars(addPillar(pillars));
          markDirty();
        }}
        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 border rounded text-sm bg-gray-50 hover:bg-gray-100"
      >
        <Plus className="w-4 h-4" /> Add Pillar
      </button>
    </div>
  );
}
