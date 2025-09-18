"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit3, Trash2, Upload, Download } from "lucide-react";
import ToolHeader from "@/components/ui/ToolHeader";

type FrameworkNode = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  type: "pillar" | "theme" | "subtheme";
  refCode: string;
  children?: FrameworkNode[];
};

type Props = {
  data: FrameworkNode[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRows = (nodes: FrameworkNode[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expanded[node.id];
      const hasChildren = node.children && node.children.length > 0;

      return (
        <React.Fragment key={node.id}>
          <tr className="border-b">
            {/* Expand / Collapse + Type + Ref Code */}
            <td className="py-2 pl-4 pr-2">
              <div className="flex items-center" style={{ marginLeft: depth * 16 }}>
                {hasChildren && (
                  <button onClick={() => toggleExpand(node.id)} className="mr-1">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
                <Badge variant={node.type}>{node.type}</Badge>
                <span className="ml-2 text-xs text-gray-600">{node.refCode}</span>
              </div>
            </td>

            {/* Name + Description */}
            <td className="py-2 px-2">
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-gray-500">{node.description}</div>
            </td>

            {/* Sort Order */}
            <td className="py-2 px-2 text-center">{node.sort_order}</td>

            {/* Actions */}
            <td className="py-2 px-2 text-center">
              <button className="p-1 text-blue-600 hover:text-blue-800">
                <Edit3 size={16} />
              </button>
              <button className="ml-2 p-1 text-red-600 hover:text-red-800">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>

          {/* Children */}
          {hasChildren && isExpanded && renderRows(node.children!, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-2">Home / Configuration / Primary Framework</div>

      {/* Tool Header with CSV import/export */}
      <ToolHeader
        title="Primary Framework Editor"
        actions={
          <div className="flex space-x-2">
            <button className="flex items-center px-2 py-1 text-sm border rounded hover:bg-gray-50">
              <Upload size={14} className="mr-1" /> Import CSV
            </button>
            <button className="flex items-center px-2 py-1 text-sm border rounded hover:bg-gray-50">
              <Download size={14} className="mr-1" /> Export CSV
            </button>
          </div>
        }
      />

      {/* Table */}
      <Card className="mt-4">
        <CardContent>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="py-2 pl-4 pr-2">Type / Ref Code</th>
                <th className="py-2 px-2">Name / Description</th>
                <th className="py-2 px-2 text-center">Sort Order</th>
                <th className="py-2 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(data)}</tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
