"use client";

import { useEffect, useState } from "react";
import {
  addPillar,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modalType, setModalType] = useState<"add-pillar" | null>(null);
  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");
  const [pillarSort, setPillarSort] = useState<number>(1);
  const [modalError, setModalError] = useState<string | null>(null);

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

  useEffect(() => {
    load();
  }, []);

  function toggleExpand(id: string) {
    const copy = new Set(expanded);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setExpanded(copy);
  }

  function openAddPillarModal() {
    const maxSort =
      pillars.length > 0 ? Math.max(...pillars.map((p) => p.sort_order)) : 0;
    setPillarSort(maxSort + 1);
    setPillarName("");
    setPillarDesc("");
    setModalType("add-pillar");
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
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setExpanded(new Set(pillars.map((p) => p.id)))
              }
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpanded(new Set())}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={openAddPillarModal}
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-2 py-1 text-sm rounded ${
              editMode
                ? "bg-rose-200 text-rose-800 hover:bg-rose-300"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
            }`}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading &&
          !error &&
          pillars.map((pillar) => (
            <div key={pillar.id} className="border-b">
              <div className="flex items-start py-2">
                <button
                  onClick={() => toggleExpand(pillar.id)}
                  className="mr-2 mt-1"
                >
                  {expanded.has(pillar.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    Pillar
                  </span>
                  <span className="font-semibold">{pillar.name}</span>
                  <div className="text-sm text-gray-600">
                    {pillar.description}
                  </div>
                </div>
                <div className="w-20 text-center">{pillar.sort_order}</div>
                <div className="w-20 text-right">
                  {editMode && (
                    <button
                      onClick={async () => {
                        try {
                          await deletePillar(pillar.id);
                          load();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  )}
                </div>
              </div>

              {expanded.has(pillar.id) && (
                <div className="ml-6 border-l pl-4">
                  {pillar.themes.map((theme) => (
                    <div key={theme.id} className="py-2">
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleExpand(theme.id)}
                          className="mr-2 mt-1"
                        >
                          {expanded.has(theme.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <div className="flex-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                            Theme
                          </span>
                          <span className="font-medium">{theme.name}</span>
                          <div className="text-sm text-gray-600">
                            {theme.description}
                          </div>
                        </div>
                        <div className="w-20 text-center">
                          {theme.sort_order}
                        </div>
                        <div className="w-20 text-right">
                          {editMode && (
                            <button
                              onClick={() => deleteTheme(theme.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 inline" />
                            </button>
                          )}
                        </div>
                      </div>

                      {expanded.has(theme.id) && (
                        <div className="ml-6 border-l pl-4">
                          {theme.subthemes.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-start py-2"
                            >
                              <div className="flex-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">
                                  Subtheme
                                </span>
                                <span>{sub.name}</span>
                                <div className="text-sm text-gray-600">
                                  {sub.description}
                                </div>
                              </div>
                              <div className="w-20 text-center">
                                {sub.sort_order}
                              </div>
                              <div className="w-20 text-right">
                                {editMode && (
                                  <button
                                    onClick={() => deleteSubtheme(sub.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4 inline" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Add Pillar Modal */}
      {modalType === "add-pillar" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Pillar</h2>
            {modalError && (
              <p className="text-red-600 mb-2">{modalError}</p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={pillarName}
                  onChange={(e) => setPillarName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={pillarSort}
                  onChange={(e) => setPillarSort(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setModalError(null);
                    await addPillar({
                      name: pillarName.trim(),
                      description: pillarDesc.trim(),
                      sort_order: pillarSort,
                    });
                    setModalType(null);
                    load();
                  } catch (err: any) {
                    console.error(err);
                    setModalError(
                      err.message || "Failed to add pillar"
                    );
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
