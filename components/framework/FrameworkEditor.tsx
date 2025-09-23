"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Data types
export type FrameworkItemType = "Pillar" | "Theme" | "Subtheme";

export type FrameworkItem = {
  id: string;
  type: FrameworkItemType;
  refCode: string;
  name: string;
  description?: string;
  sortOrder: number;
  children?: FrameworkItem[];
};

// Demo data (replace with real data hookup later)
const sampleData: FrameworkItem[] = [
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
          {
            id: "1-1-2",
            type: "Subtheme",
            refCode: "ST1.1.2",
            name: "Location risks",
            description: "Risks from site or surroundings",
            sortOrder: 2,
          },
        ],
      },
      {
        id: "1-2",
        type: "Theme",
        refCode: "T1.2",
        name: "Overcrowding & Privacy",
        description: "Sufficient space and privacy in shelters",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "2",
    type: "Pillar",
    refCode: "P2",
    name: "The Living Conditions",
    description: "People can live properly and with dignity in their dwelling",
    sortOrder: 2,
  },
];

// Helper for colored type badges
const typeBadgeClass = (type: FrameworkItemType) => {
  switch (type) {
    case "Pillar":
      return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "Theme":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Subtheme":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    default:
      return "";
  }
};

export default function FrameworkEditor() {
  const [data, setData] = useState<FrameworkItem[]>(sampleData);
  const [editMode, setEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Expand/Collapse utils
  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collectAllIds = (items: FrameworkItem[], acc: Set<string>) => {
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

  // Action handlers (placeholders for now)
  const handleAdd = (parentId: string) => {
    console.log("Add clicked:", parentId);
  };

  const handleEdit = (id: string) => {
    console.log("Edit clicked:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked:", id);
  };

  const handleAddPillar = () => {
    console.log("Add Pillar clicked");
  };

  // Render a single row (and its children)
  const renderRow = (item: FrameworkItem, depth = 0): React.ReactNode => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = !!item.children?.length;

    const indentPx = depth * 12; // slight indent per level

    return (
      <React.Fragment key={item.id}>
        <TableRow className="hover:bg-muted/40">
          {/* Type / Ref Code */}
          <TableCell className="w-1/4 align-top">
            <div className="flex items-start">
              {/* Expand chevron (only if children) */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="mr-1 rounded p-1 hover:bg-muted"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-6" />
              )}

              {/* Indented content */}
              <div style={{ paddingLeft: indentPx }} className="flex items-center">
                <Badge className={`mr-2 ${typeBadgeClass(item.type)}`}>{item.type}</Badge>
                <span className="text-sm text-muted-foreground">{item.refCode}</span>
              </div>
            </div>
          </TableCell>

          {/* Name / Description */}
          <TableCell className="align-top">
            <div style={{ paddingLeft: indentPx }}>
              <div className="font-medium leading-6">{item.name}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground leading-5">{item.description}</div>
              )}
            </div>
          </TableCell>

          {/* Sort Order */}
          <TableCell className="w-24 align-top">
            <div className="text-sm tabular-nums">{item.sortOrder}</div>
          </TableCell>

          {/* Actions */}
          <TableCell className="w-36 align-top">
            {editMode && (
              <div className="flex items-center gap-1">
                {/* Add is hidden for Subthemes */}
                {item.type !== "Subtheme" && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAdd(item.id)}
                    aria-label="Add"
                  >
                    <Plus size={16} />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(item.id)}
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </TableCell>
        </TableRow>

        {/* Children */}
        {hasChildren && isExpanded && item.children!.map((c) => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            type="button"
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
          {editMode && (
            <Button size="sm" type="button" onClick={handleAddPillar}>
              Add Pillar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" type="button" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" type="button" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Type / Ref Code</TableHead>
            <TableHead>Name / Description</TableHead>
            <TableHead className="w-24">Sort Order</TableHead>
            <TableHead className="w-36">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{data.map((item) => renderRow(item))}</TableBody>
      </Table>
    </div>
  );
}
