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
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import {
  buildRefCodeMap,
  RefMeta,
  cloneFramework,
} from "@/lib/framework-utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown, Save, Edit3 } from "lucide-react";

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(initialPillars);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const refMap: Record<string, RefMeta> = buildRefCodeMap(pillars);

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleEdit = (id: string) =>
    setEditing(prev => ({ ...prev, [id]: !prev[id] }));

  const markDirty = () => setDirty(true);

  const handleSave = async () => {
    await saveFramework(pillars);
    setDirty(false);
  };

  type NodeType = "pillar" | "theme" | "subtheme";

  const Row = ({
    node,
    type,
    parentId,
    grandParentId,
  }: {
    node: NestedPillar | NestedTheme | NestedSubtheme;
    type: NodeType;
    parentId?: string;
    grandParentId?: string;
  }) => {
    const isExpanded = expanded[node.id];
    const isEditing = editing[node.id];

    return (
      <>
        <tr className={dirty ? "bg-red-50" : ""}>
          <td className="py-2 px-2 w-6">
            {(type === "pillar" || type === "theme") && (
              <button onClick={() => toggleExpand(node.id)}>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </td>
          <td className="py-2 px-2">
            <div className="flex flex-col">
              <span className="font-medium">
                {isEditing ? (
                  <input
                    value={node.name}
                    onChange={e => {
                      node.name = e.target.value;
                      setPillars([...pillars]);
                      markDirty();
                    }}
                    className="border rounded px-1 text-sm"
                  />
                ) : (
                  node.name
                )}
              </span>
              <span className="text-xs text-gray-500">
                {isEditing ? (
                  <input
                    value={(node as any).description ?? ""}
                    onChange={e => {
                      (node as any).description = e.target.value;
                      setPillars([...pillars]);
                      markDirty();
                    }}
                    className="border rounded px-1 text-xs mt-1"
                  />
                ) : (
                  (node as any).description ?? ""
                )}
              </span>
            </div>
          </td>
          <td className="py-2 px-2">
            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
              {type.toUpperCase()}
            </span>
          </td>
          <td className="py-2 px-2 text-xs text-gray-600">
            {refMap[node.id]?.code}
          </td>
          <td className="py-2 px-2 space-x-2">
            <button
              onClick={() => toggleEdit(node.id)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (type === "pillar") {
                  setPillars(removePillar(pillars, node.id));
                } else if (type === "theme") {
                  setPillars(removeTheme(pillars, parentId!, node.id));
                } else {
                  setPillars(removeSubtheme(pillars, grandParentId!, parentId!, node.id));
                }
                markDirty();
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (type === "pillar") setPillars(movePillar(pillars, node.id, -1));
                else if (type === "theme") setPillars(moveTheme(pillars, parentId!, node.id, -1));
                else setPillars(moveSubtheme(pillars, grandParentId!, parentId!, node.id, -1));
                markDirty();
              }}
            >
              <ArrowUp className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
            <button
              onClick={() => {
                if (type === "pillar") setPillars(movePillar(pillars, node.id, 1));
                else if (type === "theme") setPillars(moveTheme(pillars, parentId!, node.id, 1));
                else setPillars(moveSubtheme(pillars, grandParentId!, parentId!, node.id, 1));
                markDirty();
              }}
            >
              <ArrowDown className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
            {type === "pillar" && (
              <button
                onClick={() => {
                  setPillars(addTheme(pillars, node.id));
                  markDirty();
                }}
              >
                <Plus className="w-4 h-4 text-gray-500 hover:text-green-600" />
              </button>
            )}
            {type === "theme" && (
              <button
                onClick={() => {
                  setPillars(addSubtheme(pillars, parentId!, node.id));
                  markDirty();
                }}
              >
                <Plus className="w-4 h-4 text-gray-500 hover:text-green-600" />
              </button>
            )}
          </td>
        </tr>

        {/* Children */}
        {isExpanded && type === "pillar" &&
          (node as NestedPillar).themes.map(t => (
            <Row
              key={t.id}
              node={t}
              type="theme"
              parentId={node.id}
              grandParentId={node.id}
            />
          ))}
        {isExpanded && type === "theme" &&
          (node as NestedTheme).subthemes.map(s => (
            <Row
              key={s.id}
              node={s}
              type="subtheme"
              parentId={node.id}
              grandParentId={grandParentId}
            />
          ))}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="flex justify-between items-center bg-yellow-50 border border-yellow-200 px-4 py-2 rounded">
          <span className="text-sm text-yellow-800">You have unsaved changes.</span>
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase text-gray-600">
            <th className="w-6"></th>
            <th className="text-left p-2">Name & Description</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Ref Code</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map(p => (
            <Row key={p.id} node={p} type="pillar" />
          ))}
        </tbody>
      </table>

      <div className="pt-2">
        <Button
          onClick={() => {
            setPillars(addPillar(pillars));
            markDirty();
          }}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Pillar
        </Button>
      </div>
    </div>
  );
}
