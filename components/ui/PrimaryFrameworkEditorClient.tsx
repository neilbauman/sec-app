"use client";

import { useEffect, useState } from "react";
import { getFramework } from "@/lib/framework";
import type { Pillar, Theme, Subtheme, Indicator } from "@/types/framework";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Edit,
  Plus,
  Trash,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
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
        const data = await getFramework();
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

  const renderIndicator = (indicators: Indicator[]) => {
    if (!indicators || indicators.length === 0) {
      return (
        <div className="flex items-center text-xs text-red-600 gap-1">
          <AlertTriangle size={14} />
          No indicator set
        </div>
      );
    }
    return (
      <div className="text-xs text-gray-700">
        {indicators[0].name}{" "}
        <span className="text-gray-500">({indicators[0].ref_code})</span>
      </div>
    );
  };

  const renderRow = (
    type: "Pillar" | "Theme" | "Subtheme",
    id: string,
    ref_code: string,
    name: string,
    description: string,
    sort_order: number,
    indicators: Indicator[],
    children?: React.ReactNode
  ) => {
    const isExpanded = expanded[id] ?? false;

    return (
      <>
        <tr key={id} className="border-b align-top">
          <td className="px-4 py-2 flex items-start gap-2 w-[20%]">
            {/* Expand/Collapse */}
            {children ? (
              <button onClick={() => toggleExpand(id)} className="mt-1 focus:outline-none">
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
          <td className="px-4 py-2 w-[50%]">
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-600">{description}</div>
            <div className="mt-1">{renderIndicator(indicators)}</div>
          </td>
          <td className="px-4 py-2 text-center w-[10%] text-sm text-gray-600">
            {sort_order}
          </td>
          <td className="px-4 py-2 flex gap-2 w-[20%]">
            <Button variant="ghost" size="sm">
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash size={16} />
            </Button>
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
      {/* Tool header */}
      <ToolHeader
        pageTitle="Primary Framework Editor"
        pageDescription="Configure pillars, themes, and sub-themes. Each requires a default indicator."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="configuration"
      />

      {/* Bulk actions */}
      <div className="flex justify-between items-center">
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[20%]">
                Type / Ref
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[50%]">
                Name / Description / Indicator
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-[10%]">
                Sort Order
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[20%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) =>
              renderRow(
                "Pillar",
                pillar.id,
                pillar.ref_code,
                pillar.name,
                pillar.description,
                pillar.sort_order,
                pillar.indicators || [],
                pillar.themes.map((theme) =>
                  renderRow(
                    "Theme",
                    theme.id,
                    theme.ref_code,
                    theme.name,
                    theme.description,
                    theme.sort_order,
                    theme.indicators || [],
                    theme.subthemes.map((sub) =>
                      renderRow(
                        "Subtheme",
                        sub.id,
                        sub.ref_code,
                        sub.name,
                        sub.description,
                        sub.sort_order,
                        sub.indicators || []
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
