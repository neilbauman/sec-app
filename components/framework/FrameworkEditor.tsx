"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronRight,
  ChevronDown,
  Upload,
  Download,
} from "lucide-react";
import { fetchFramework, Pillar } from "@/lib/framework-client";

// Component
export default function FrameworkEditor({ group, page }: { group: "configuration"; page: "primary" }) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFramework();
        setPillars(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load framework data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    pillars.forEach((p) => {
      allIds.add(p.id);
      p.themes.forEach((t) => {
        allIds.add(t.id);
        t.subthemes.forEach((s) => allIds.add(s.id));
      });
    });
    setExpanded(allIds);
  };

  const collapseAll = () => setExpanded(new Set());

  const renderRow = (
    type: "Pillar" | "Theme" | "Subtheme",
    code: string,
    name: string,
    description: string,
    sortOrder: number,
    id: string,
    children?: React.ReactNode
  ) => {
    const isOpen = expanded.has(id);
    const indentClass =
      type === "Theme"
        ? "pl-6"
        : type === "Subtheme"
        ? "pl-12"
        : "pl-2";

    return (
      <>
        <tr className="border-b">
          <td className="py-2 pr-2 pl-4">
            {children && (
              <button
                onClick={() => toggleExpand(id)}
                className="mr-1 text-gray-600"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                type === "Pillar"
                  ? "bg-blue-100 text-blue-700"
                  : type === "Theme"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {type}
            </span>
            <span className="ml-2 text-gray-600 text-sm">{code}</span>
          </td>
          <td className={`${indentClass} py-2`}>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-gray-600 text-sm">{description}</div>
          </td>
          <td className="py-2 text-center">{sortOrder}</td>
          <td className="py-2 text-right">
            {editMode ? (
              <button className="text-blue-600 hover:underline">
                Edit
              </button>
            ) : (
              "—"
            )}
          </td>
        </tr>
        {isOpen && children}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        group={group}
        page={page}
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white shadow rounded-lg p-4">
        {/* Controls */}
        <div className="flex justify-between mb-3">
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 rounded border text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 rounded border text-sm"
            >
              Collapse All
            </button>
          </div>
          <div className="space-x-2 flex items-center">
            <Upload className="h-5 w-5 text-gray-500 cursor-pointer" />
            <Download className="h-5 w-5 text-gray-500 cursor-pointer" />
            {editMode && (
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                + Add Pillar
              </button>
            )}
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm"
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-gray-700">
              <th className="py-2 pl-4 w-1/4">Type / Ref Code</th>
              <th className="py-2 w-2/4">Name / Description</th>
              <th className="py-2 text-center w-1/6">Sort Order</th>
              <th className="py-2 text-right w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-gray-500 py-4 text-center">
                  Loading framework…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={4} className="text-red-600 py-4 text-center">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              pillars.map((pillar) =>
                renderRow(
                  "Pillar",
                  `P${pillar.sort_order}`,
                  pillar.name,
                  pillar.description,
                  pillar.sort_order,
                  pillar.id,
                  pillar.themes.map((theme) =>
                    renderRow(
                      "Theme",
                      `T${pillar.sort_order}.${theme.sort_order}`,
                      theme.name,
                      theme.description,
                      theme.sort_order,
                      theme.id,
                      theme.subthemes.map((sub) =>
                        renderRow(
                          "Subtheme",
                          `ST${pillar.sort_order}.${theme.sort_order}.${sub.sort_order}`,
                          sub.name,
                          sub.description,
                          sub.sort_order,
                          sub.id
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
