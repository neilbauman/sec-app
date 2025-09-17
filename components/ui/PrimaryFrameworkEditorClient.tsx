"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
} from "lucide-react";

interface Subtheme {
  id: string; // internal
  ref_code: string; // human readable
  name: string;
  description: string;
  sort_order: number;
}

interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFramework();
  }, []);

  async function fetchFramework() {
    const { data: pillarsData, error } = await supabase
      .from("pillars")
      .select(
        `
        id, ref_code, name, description, sort_order,
        themes (
          id, ref_code, name, description, sort_order,
          subthemes (
            id, ref_code, name, description, sort_order
          )
        )
      `
      )
      .order("sort_order");

    if (error) {
      console.error("Error fetching framework:", error);
    } else {
      setPillars(pillarsData || []);
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRow = (
    item: Pillar | Theme | Subtheme,
    type: "Pillar" | "Theme" | "Subtheme"
  ) => {
    const isExpanded = expanded[item.id];
    const hasChildren =
      type === "Pillar"
        ? (item as Pillar).themes?.length > 0
        : type === "Theme"
        ? (item as Theme).subthemes?.length > 0
        : false;

    const indentClass =
      type === "Theme"
        ? "pl-6"
        : type === "Subtheme"
        ? "pl-12"
        : "";

    return (
      <>
        <tr key={item.id}>
          {/* TYPE / REF CODE */}
          <td className={`w-1/6 align-top ${indentClass}`}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
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
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.ref_code}</div>
          </td>

          {/* NAME / DESCRIPTION */}
          <td className="w-2/3 align-top">
            <div className="text-sm font-medium text-gray-900">
              {item.name}
            </div>
            <div className="text-xs text-gray-600">{item.description}</div>
          </td>

          {/* SORT ORDER */}
          <td className="w-1/12 align-top text-sm text-gray-700">
            {item.sort_order}
          </td>

          {/* ACTIONS */}
          <td className="w-1/6 align-top">
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Edit2 size={16} className="text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Plus size={16} className="text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Trash2 size={16} className="text-gray-600" />
              </button>
            </div>
          </td>
        </tr>

        {/* Render Children */}
        {isExpanded &&
          type === "Pillar" &&
          (item as Pillar).themes.map((theme) =>
            renderRow(theme, "Theme")
          )}
        {isExpanded &&
          type === "Theme" &&
          (item as Theme).subthemes.map((sub) =>
            renderRow(sub, "Subtheme")
          )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* CSV Actions */}
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50">
          <Upload size={16} /> Upload CSV
        </button>
        <button className="flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50">
          <Download size={16} /> Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 w-1/6">Type / Ref Code</th>
              <th className="px-6 py-3 w-2/3">Name / Description</th>
              <th className="px-6 py-3 w-1/12">Sort Order</th>
              <th className="px-6 py-3 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {pillars.map((pillar) => renderRow(pillar, "Pillar"))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
