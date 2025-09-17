"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFramework } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Edit,
  Plus,
  Trash,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import ToolHeader from "@/components/ui/ToolHeader";

interface NodeState {
  [id: string]: boolean;
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<NodeState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFramework();
        setPillars(data);
      } catch (err) {
        console.error("Error fetching framework:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRow = (
    type: "Pillar" | "Theme" | "Subtheme",
    ref_code: string,
    name: string,
    description: string,
    sort_order: number,
    children?: React.ReactNode
  ) => {
    const isExpanded = expanded[ref_code] ?? false;

    return (
      <>
        <tr key={ref_code} className="border-b">
          <td className="px-4 py-2 flex items-center gap-2">
            {/* Expand/Collapse */}
            {children ? (
              <button
                onClick={() => toggleExpand(ref_code)}
                className="focus:outline-none"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            {/* Tag */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === "Pillar"
                  ? "bg-blue-100 text-blue-800"
                  : type === "Theme"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {type}
            </span>
            <span className="text-xs text-gray-500">{ref_code}</span>
          </td>
          <td className="px-4 py-2">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-600">{description}</div>
          </td>
          <td className="px-4 py-2 text-sm text-gray-600">{sort_order}</td>
          <td className="px-4 py-2 flex gap-2">
            <button className="p-1 hover:text-blue-600">
              <Edit size={16} />
            </button>
            <button className="p-1 hover:text-green-600">
              <Plus size={16} />
            </button>
            <button className="p-1 hover:text-red-600">
              <Trash size={16} />
            </button>
          </td>
        </tr>
        {isExpanded && children}
      </>
    );
  };

  if (loading) {
    return <div className="p-4">Loading framework data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Global Tool Header */}
      <ToolHeader />

      {/* Page-specific breadcrumb + title */}
      <nav className="text-sm text-gray-500 mt-4 mb-2">
        <Link href="/" className="hover:underline text-blue-600">
          Dashboard
        </Link>{" "}
        &gt; Frameworks &gt;{" "}
        <span className="text-gray-700 font-medium">Primary Framework</span>
      </nav>
      <h2 className="text-xl font-semibold text-gray-900">Primary Framework</h2>
      <p className="text-gray-600 mb-4">Configure pillars, themes, and sub-themes.</p>

      {/* Bulk actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Primary Framework Editor</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" /> Upload CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" /> Download CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Type / Ref
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name / Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Sort Order
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) =>
              renderRow(
                "Pillar",
                pillar.ref_code,
                pillar.name,
                pillar.description,
                pillar.sort_order,
                pillar.themes.map((theme) =>
                  renderRow(
                    "Theme",
                    theme.ref_code,
                    theme.name,
                    theme.description,
                    theme.sort_order,
                    theme.subthemes.map((sub) =>
                      renderRow(
                        "Subtheme",
                        sub.ref_code,
                        sub.name,
                        sub.description,
                        sub.sort_order
                      )
                    )
                  )
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
