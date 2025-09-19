// components/framework/FrameworkEditor.tsx

"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2, Plus, Upload, Download, FileText, Settings } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { getFrameworkTree } from "@/lib/hooks/useFramework";
import { withRefCodes } from "@/lib/refCodes";
import type { FrameworkTree, Pillar, Theme, Subtheme } from "@/types/framework";

export default function FrameworkEditor() {
  const [tree, setTree] = useState<FrameworkTree | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const raw = await getFrameworkTree();
      const coded = withRefCodes(raw);
      setTree(coded);
    }
    load();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    if (!tree) return;
    const all: Record<string, boolean> = {};
    tree.pillars.forEach((p) => {
      all[p.id] = true;
      p.themes?.forEach((t) => {
        all[t.id] = true;
        t.subthemes?.forEach((s) => {
          all[s.id] = true;
        });
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  if (!tree) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: "Configuration",
          icon: <Settings className="w-6 h-6 text-green-600" />,
          color: "text-green-600",
        }}
        page={{
          title: (
            <span className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Primary Framework Editor
            </span>
          ),
          description:
            "Define and manage the global SSC framework including pillars, themes, and subthemes.",
        }}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Collapse All
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Upload CSV"
          >
            <Upload className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Download CSV"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Add Pillar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="w-[15%] px-4 py-2 text-left">Type / Ref Code</th>
              <th className="w-[55%] px-4 py-2 text-left">Name / Description</th>
              <th className="w-[10%] px-4 py-2 text-center">Sort Order</th>
              <th className="w-[20%] px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tree.pillars.map((pillar, pIdx) => (
              <FrameworkRow
                key={pillar.id}
                item={pillar}
                level="pillar"
                expanded={expanded}
                toggleExpand={toggleExpand}
                index={pIdx}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RowProps {
  item: Pillar | Theme | Subtheme;
  level: "pillar" | "theme" | "subtheme";
  expanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  index: number;
}

function FrameworkRow({ item, level, expanded, toggleExpand, index }: RowProps) {
  const isExpanded = expanded[item.id] || false;
  const hasChildren =
    level === "pillar"
      ? (item as Pillar).themes?.length
      : level === "theme"
      ? (item as Theme).subthemes?.length
      : false;

  const nextLevel =
    level === "pillar" ? "theme" : level === "theme" ? "subtheme" : null;

  const indentClass =
    level === "pillar"
      ? "pl-2"
      : level === "theme"
      ? "pl-6"
      : "pl-10";

  const tagColor =
    level === "pillar"
      ? "bg-blue-100 text-blue-800"
      : level === "theme"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <>
      <tr className="border-t">
        {/* Type / Ref Code */}
        <td className="px-4 py-2 align-top">
          <div className={`flex items-center gap-1 ${indentClass}`}>
            {hasChildren && (
              <button onClick={() => toggleExpand(item.id)}>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${tagColor}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
            {item.ref_code && (
              <span className="text-xs text-gray-500">{item.ref_code}</span>
            )}
          </div>
        </td>

        {/* Name / Description */}
        <td className="px-4 py-2 align-top">
          <div className={`flex flex-col ${indentClass}`}>
            <span className="font-medium">{item.name}</span>
            {item.description && (
              <span className="text-xs text-gray-500">{item.description}</span>
            )}
          </div>
        </td>

        {/* Sort Order */}
        <td className="px-4 py-2 text-center align-top">{item.sort_order}</td>

        {/* Actions */}
        <td className="px-4 py-2 text-right align-top">
          <div className="flex justify-end gap-2">
            <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            {level !== "subtheme" && (
              <button className="p-1 hover:bg-gray-100 rounded" title="Add Child">
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Children */}
      {isExpanded && nextLevel && level === "pillar" && (
        (item as Pillar).themes?.map((theme, tIdx) => (
          <FrameworkRow
            key={theme.id}
            item={theme}
            level="theme"
            expanded={expanded}
            toggleExpand={toggleExpand}
            index={tIdx}
          />
        ))
      )}
      {isExpanded && nextLevel && level === "theme" && (
        (item as Theme).subthemes?.map((sub, sIdx) => (
          <FrameworkRow
            key={sub.id}
            item={sub}
            level="subtheme"
            expanded={expanded}
            toggleExpand={toggleExpand}
            index={sIdx}
          />
        ))
      )}
    </>
  );
}
