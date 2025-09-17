// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useEffect, useState } from "react";
import { getFramework } from "@/lib/framework";
import type { Pillar } from "@/types/framework";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Plus, Trash, ChevronRight, ChevronDown } from "lucide-react";

interface NodeState {
  [id: string]: boolean;
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<NodeState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFramework();
        setPillars(data);
      } catch (err) {
        console.error("Error fetching framework:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRow = (
    type: "Pillar" | "Theme" | "Subtheme",
    key: string,
    ref_code: string,
    name: string,
    description: string,
    sort_order: number,
    children?: React.ReactNode
  ) => {
    const isExpanded = expanded[key] ?? false;

    const tagClass =
      type === "Pillar"
        ? "bg-blue-100 text-blue-800"
        : type === "Theme"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"; // Subtheme red per your preference

    return (
      <>
        <tr key={key} className="border-b">
          <td className="px-4 py-2">
            <div className="flex items-center gap-2">
              {children ? (
                <button onClick={() => toggle(key)} className="focus:outline-none">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-4" />
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagClass}`}>{type}</span>
              <span className="text-xs text-gray-500">{ref_code}</span>
            </div>
          </td>
          <td className="px-4 py-2">
            <div className="text-[0.95rem] font-semibold">{name}</div>
            <div className="text-sm text-gray-600">{description}</div>
          </td>
          <td className="px-4 py-2 text-center text-sm text-gray-700">{sort_order}</td>
          <td className="px-4 py-2 flex gap-2 justify-end">
            <button className="p-1 hover:text-blue-600" aria-label="Edit">
              <Edit size={16} />
            </button>
            <button className="p-1 hover:text-green-600" aria-label="Add">
              <Plus size={16} />
            </button>
            <button className="p-1 hover:text-red-600" aria-label="Delete">
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
      {/* Bulk actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Primary Framework Editor</h2>
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
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "58%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type / Ref</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name / Description</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Sort Order</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((p) =>
              renderRow(
                "Pillar",
                p.id,
                p.ref_code,
                p.name,
                p.description,
                p.sort_order,
                p.themes.map((t) =>
                  renderRow(
                    "Theme",
                    t.id,
                    t.ref_code,
                    t.name,
                    t.description,
                    t.sort_order,
                    t.subthemes.map((s) =>
                      renderRow("Subtheme", s.id, s.ref_code, s.name, s.description, s.sort_order)
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
