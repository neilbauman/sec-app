"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { NestedPillar } from "@/lib/types";

// Inline Badge component
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const sampleData: NestedPillar[] = [
  {
    id: "1",
    type: "Pillar",
    refCode: "P1",
    name: "The Shelter",
    description: "People have a dwelling",
    sortOrder: 1,
    children: [
      {
        id: "1-1",
        type: "Theme",
        refCode: "T1.1",
        name: "Physical Safety",
        description: "Households live in safe and secure shelters",
        sortOrder: 1,
        children: [
          {
            id: "1-1-1",
            type: "Subtheme",
            refCode: "ST1.1.1",
            name: "Secure structures",
            description: "Safe against weather and hazards",
            sortOrder: 1,
          },
        ],
      },
    ],
  },
];

const typeBadgeClass = (type?: "Pillar" | "Theme" | "Subtheme") => {
  switch (type) {
    case "Pillar":
      return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "Theme":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Subtheme":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

export default function FrameworkEditor({ initialPillars = [] }: { initialPillars?: NestedPillar[] }) {
  const [data, setData] = useState<NestedPillar[]>(initialPillars.length ? initialPillars : sampleData);
  const [editMode, setEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collectAllIds = (items: NestedPillar[], acc: Set<string>) => {
    for (const item of items) {
      acc.add(item.id);
      if (item.children?.length) collectAllIds(item.children, acc);
    }
  };

  const expandAll = () => {
    const all = new Set<string>();
    collectAllIds(data, all);
    setExpandedRows(all);
  };

  const collapseAll = () => setExpandedRows(new Set());

  const handleAdd = (parentId: string) => console.log("Add", parentId);
  const handleEdit = (id: string) => console.log("Edit", id);
  const handleDelete = (id: string) => console.log("Delete", id);
  const handleAddPillar = () => console.log("Add Pillar");

  const renderRow = (item: NestedPillar, depth = 0): React.ReactNode => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = !!item.children?.length;
    const indentPx = depth * 16;

    return (
      <React.Fragment key={item.id}>
        <tr className="border-b hover:bg-muted/40">
          {/* Type / Ref Code */}
          <td className="w-1/4 align-top py-3">
            <div className="flex items-start">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="mr-1 rounded p-1 hover:bg-muted"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-6" />
              )}
              <div style={{ paddingLeft: indentPx }} className="flex items-center">
                <Badge className={`mr-2 ${typeBadgeClass(item.type)}`}>{item.type ?? ""}</Badge>
                <span className="text-sm text-muted-foreground">{item.refCode ?? ""}</span>
              </div>
            </div>
          </td>

          {/* Name / Description */}
          <td className="align-top py-3">
            <div style={{ paddingLeft: indentPx }}>
              <div className="font-medium leading-6">{item.name}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground leading-5">{item.description}</div>
              )}
            </div>
          </td>

          {/* Sort Order */}
          <td className="w-24 align-top py-3">
            <div className="text-sm tabular-nums">{item.sortOrder ?? ""}</div>
          </td>

          {/* Actions */}
          <td className="w-36 align-top py-3">
            {editMode && (
              <div className="flex items-center gap-1">
                {item.type !== "Subtheme" && (
                  <Button size="sm" variant="ghost" className="p-1 h-8 w-8" onClick={() => handleAdd(item.id)}>
                    <Plus size={16} />
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="p-1 h-8 w-8" onClick={() => handleEdit(item.id)}>
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="ghost" className="p-1 h-8 w-8" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </td>
        </tr>
        {hasChildren && isExpanded && item.children!.map((c) => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
          {editMode && (
            <Button size="sm" onClick={handleAddPillar}>
              Add Pillar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <table className="w-full caption-bottom text-sm border-collapse">
        <thead className="[&_tr]:border-b bg-muted/30">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-1/4">
              Type / Ref Code
            </th>
            <th className="text-left">Name / Description</th>
            <th className="w-24 text-left">Sort Order</th>
            <th className="w-36 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  );
}
