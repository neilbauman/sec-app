"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

export type NestedPillar = {
  id: string;
  type: "Pillar" | "Theme" | "Subtheme";
  refCode?: string;
  name: string;
  description?: string;
  sortOrder?: number;
  children?: NestedPillar[];
};

// Badge colors by type
const badgeColors: Record<NestedPillar["type"], string> = {
  Pillar: "bg-indigo-100 text-indigo-800",
  Theme: "bg-emerald-100 text-emerald-800",
  Subtheme: "bg-amber-100 text-amber-800",
};

type FrameworkEditorProps = {
  initialPillars: NestedPillar[];
};

export default function FrameworkEditor({ initialPillars }: FrameworkEditorProps) {
  const [pillars] = useState<NestedPillar[]>(initialPillars);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // Toggle expand/collapse per row
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const collect = (nodes: NestedPillar[]) => {
      for (const node of nodes) {
        all[node.id] = true;
        if (node.children) collect(node.children);
      }
    };
    collect(pillars);
    setExpandedRows(all);
  };

  const collapseAll = () => {
    setExpandedRows({});
  };

  // Recursive renderer
  const renderRows = (nodes: NestedPillar[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedRows[node.id];
      const hasChildren = node.children && node.children.length > 0;

      return (
        <React.Fragment key={node.id}>
          <tr className="hover:bg-gray-50">
            {/* Type / Ref Code */}
            <td className="py-3 pl-4 pr-2">
              <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
                {hasChildren && (
                  <button
                    onClick={() => toggleRow(node.id)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeColors[node.type]}`}
                >
                  {node.type}
                </span>
                {node.refCode && (
                  <span className="text-sm text-gray-500">{node.refCode}</span>
                )}
              </div>
            </td>

            {/* Name / Description */}
            <td className="py-3">
              <div style={{ paddingLeft: depth * 20 }}>
                <div className="font-medium">{node.name}</div>
                {node.description && (
                  <div className="text-sm text-gray-500">{node.description}</div>
                )}
              </div>
            </td>

            {/* Sort Order */}
            <td className="py-3 text-right tabular-nums pr-4">
              {node.sortOrder ?? ""}
            </td>

            {/* Actions */}
            <td className="py-3 pr-4 text-right">
              {editMode && (
                <div className="flex justify-end gap-1">
                  {node.type !== "Subtheme" && (
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </td>
          </tr>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && renderRows(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => setEditMode((m) => !m)}
          >
            {editMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
          {editMode && (
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-1" />
              Add Pillar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="ghost" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Type / Ref Code</th>
            <th className="text-left py-2">Name / Description</th>
            <th className="text-right px-4 py-2">Sort Order</th>
            <th className="text-right px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>{renderRows(pillars)}</tbody>
      </table>
    </div>
  );
}
