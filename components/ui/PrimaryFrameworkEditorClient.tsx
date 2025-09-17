"use client";

import { useEffect, useState } from "react";
import { getFrameworkWithThemes } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash, ChevronRight, ChevronDown, Download, Upload } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";

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
        const data = await getFrameworkWithThemes();
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
    id: string,
    ref_code: string,
    name: string,
    description: string,
    sort_order: number,
    children?: React.ReactNode,
    level: number = 0
  ) => {
    const isExpanded = expanded[id] ?? false;

    return (
      <>
        <tr key={id} className="border-b">
          {/* Indent by level */}
          <td className="px-4 py-2">
            <div className="flex items-center gap-2" style={{ marginLeft: `${level * 16}px` }}>
              {children ? (
                <button onClick={() => toggleExpand(id)} className="focus:outline-none">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-4" />
              )}
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
            </div>
          </td>

          {/* Name / Description */}
          <td className="px-4 py-2">
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs text-gray-600">{description}</div>
          </td>

          {/* Sort order */}
          <td className="px-4 py-2 text-center text-sm text-gray-600">{sort_order}</td>

          {/* Actions */}
          <td className="px-4 py-2 flex gap-2 justify-end">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash className="h-4 w-4" />
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
      {/* Tool header with breadcrumbs */}
      <ToolHeader
        pageTitle="Primary Framework Editor"
        pageDescription="Configure pillars, themes, and sub-themes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="configuration"
      />

      {/* Bulk actions */}
      <div className="flex justify-between items-center">
        <div />
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
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-[20%] px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Type / Ref
              </th>
              <th className="w-[55%] px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name / Description
              </th>
              <th className="w-[10%] px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                Sort Order
              </th>
              <th className="w-[15%] px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
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
                pillar.themes.map((theme) =>
                  renderRow(
                    "Theme",
                    theme.id,
                    theme.ref_code,
                    theme.name,
                    theme.description,
                    theme.sort_order,
                    theme.subthemes.map((sub) =>
                      renderRow(
                        "Subtheme",
                        sub.id,
                        sub.ref_code,
                        sub.name,
                        sub.description,
                        sub.sort_order
                      )
                    ),
                    1
                  )
                ),
                0
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
