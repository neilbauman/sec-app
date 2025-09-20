"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import {
  addPillar,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Download,
} from "lucide-react";

interface Pillar {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

interface Theme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

interface Subtheme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

type ModalType = "add-pillar" | "edit-pillar" | "delete-pillar";

export default function FrameworkEditor({
  group,
  page,
}: {
  group: "configuration";
  page: "primary";
}) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");
  const [pillarSort, setPillarSort] = useState<number>(1);
  const [modalError, setModalError] = useState<string | null>(null);

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

  function toggleExpand(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
  }

  function expandAll() {
    const all = new Set<string>();
    pillars.forEach((p) => {
      all.add(p.id);
      p.themes.forEach((t) => {
        all.add(t.id);
        t.subthemes.forEach((s) => all.add(s.id));
      });
    });
    setExpanded(all);
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  function openAddPillarModal() {
    const maxSort =
      pillars.length > 0 ? Math.max(...pillars.map((p) => p.sort_order)) : 0;
    setPillarSort(maxSort + 1); // default to last+1
    setPillarName("");
    setPillarDesc("");
    setModalType("add-pillar");
    setModalError(null);
  }

  async function handleSavePillar() {
    setModalError(null);
    try {
      await addPillar({
        name: pillarName.trim(),
        description: pillarDesc.trim(),
        sort_order: pillarSort,
      });
      // refresh
      const data = await fetchFramework();
      setPillars(data);
      setModalType(null);
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Failed to save pillar.");
    }
  }

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

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 bg-gray-100 rounded text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 bg-gray-100 rounded text-sm"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={openAddPillarModal}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <div className="space-x-2">
            <button className="px-3 py-1.5 bg-gray-100 rounded text-sm">
              <Upload className="h-4 w-4 inline mr-1" />
              Upload CSV
            </button>
            <button className="px-3 py-1.5 bg-gray-100 rounded text-sm">
              <Download className="h-4 w-4 inline mr-1" />
              Download CSV
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1.5 bg-orange-200 text-orange-800 rounded text-sm"
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="w-1/5 text-left py-2">Type / Ref Code</th>
                <th className="w-3/5 text-left py-2">Name / Description</th>
                <th className="w-1/10 text-center py-2">Sort Order</th>
                <th className="w-1/10 text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, pIndex) => {
                const isOpen = expanded.has(pillar.id);
                return (
                  <>
                    <tr key={pillar.id} className="border-b bg-gray-50">
                      <td className="py-2 pr-2 pl-4">
                        {pillar.themes.length > 0 && (
                          <button
                            onClick={() => toggleExpand(pillar.id)}
                            className="mr-2"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Pillar
                        </span>{" "}
                        P{pillar.sort_order}
                      </td>
                      <td className="py-2">
                        <div className="font-semibold">{pillar.name}</div>
                        <div className="text-sm text-gray-600">
                          {pillar.description}
                        </div>
                      </td>
                      <td className="py-2 text-center">{pillar.sort_order}</td>
                      <td className="py-2 text-right">
                        {editMode && (
                          <button
                            onClick={() => deletePillar(pillar.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                    {isOpen &&
                      pillar.themes.map((theme) => {
                        const themeOpen = expanded.has(theme.id);
                        return (
                          <>
                            <tr key={theme.id} className="border-b">
                              <td className="py-2 pr-2 pl-8">
                                {theme.subthemes.length > 0 && (
                                  <button
                                    onClick={() => toggleExpand(theme.id)}
                                    className="mr-2"
                                  >
                                    {themeOpen ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Theme
                                </span>{" "}
                                T{pillar.sort_order}.{theme.sort_order}
                              </td>
                              <td className="py-2">
                                <div className="font-medium">{theme.name}</div>
                                <div className="text-sm text-gray-600">
                                  {theme.description}
                                </div>
                              </td>
                              <td className="py-2 text-center">
                                {theme.sort_order}
                              </td>
                              <td className="py-2 text-right">
                                {editMode && (
                                  <button
                                    onClick={() => deleteTheme(theme.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4 inline" />
                                  </button>
                                )}
                              </td>
                            </tr>
                            {themeOpen &&
                              theme.subthemes.map((sub) => (
                                <tr key={sub.id} className="border-b">
                                  <td className="py-2 pr-2 pl-12">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Subtheme
                                    </span>{" "}
                                    ST{pillar.sort_order}.
                                    {theme.sort_order}.{sub.sort_order}
                                  </td>
                                  <td className="py-2">
                                    <div>{sub.name}</div>
                                    <div className="text-sm text-gray-600">
                                      {sub.description}
                                    </div>
                                  </td>
                                  <td className="py-2 text-center">
                                    {sub.sort_order}
                                  </td>
                                  <td className="py-2 text-right">
                                    {editMode && (
                                      <button
                                        onClick={() => deleteSubtheme(sub.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4 inline" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </>
                        );
                      })}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Pillar Modal */}
      {modalType === "add-pillar" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Add Pillar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={pillarName}
                  onChange={(e) => setPillarName(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Sort Order</label>
                <input
                  type="number"
                  value={pillarSort}
                  onChange={(e) => setPillarSort(parseInt(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              {modalError && (
                <p className="text-red-600 text-sm">{modalError}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 bg-gray-100 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePillar}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
