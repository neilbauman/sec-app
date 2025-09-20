"use client";

import { useEffect, useState } from "react";
import {
  fetchFramework,
  Pillar,
  Theme,
  Subtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  // deletePillar, // future
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import { ChevronRight, ChevronDown } from "lucide-react";

type ModalType = "add-pillar" | null;

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

  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");
  const [pillarSort, setPillarSort] = useState(1);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchFramework();
      setPillars(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load framework data.");
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleAddPillar() {
    setModalError(null);
    try {
      await addPillar({
        name: pillarName.trim(),
        description: pillarDesc.trim(),
        sort_order: pillarSort,
      });
      setModalType(null);
      setPillarName("");
      setPillarDesc("");
      setPillarSort(1);
      await load();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Failed to add pillar");
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

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setExpanded(new Set(pillars.map((p) => p.id)))}
              className="px-2 py-1 border rounded text-sm"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpanded(new Set())}
              className="px-2 py-1 border rounded text-sm"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={() => setModalType("add-pillar")}
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-orange-200 text-orange-800 px-3 py-1 rounded hover:bg-orange-300"
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="w-1/4 px-2 py-2">Type / Ref Code</th>
                <th className="w-2/4 px-2 py-2">Name / Description</th>
                <th className="w-1/8 px-2 py-2 text-center">Sort Order</th>
                <th className="w-1/8 px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, pIndex) => (
                <>
                  <tr
                    key={pillar.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-1">
                        {pillar.themes?.length > 0 && (
                          <button onClick={() => toggleExpand(pillar.id)}>
                            {expanded.has(pillar.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                          Pillar
                        </span>
                        <span className="text-xs text-gray-600">{`P${
                          pIndex + 1
                        }`}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-semibold">{pillar.name}</div>
                      <div className="text-gray-600 text-xs">
                        {pillar.description}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {pillar.sort_order}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {editMode ? "—" : ""}
                    </td>
                  </tr>

                  {expanded.has(pillar.id) &&
                    pillar.themes.map((theme, tIndex) => (
                      <>
                        <tr
                          key={theme.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-2 py-2 pl-8">
                            <div className="flex items-center space-x-1">
                              {theme.subthemes?.length > 0 && (
                                <button onClick={() => toggleExpand(theme.id)}>
                                  {expanded.has(theme.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                                Theme
                              </span>
                              <span className="text-xs text-gray-600">{`T${
                                pIndex + 1
                              }.${tIndex + 1}`}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-gray-600 text-xs">
                              {theme.description}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            {theme.sort_order}
                          </td>
                          <td className="px-2 py-2 text-right">
                            {editMode ? "—" : ""}
                          </td>
                        </tr>

                        {expanded.has(theme.id) &&
                          theme.subthemes.map((sub, sIndex) => (
                            <tr
                              key={sub.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="px-2 py-2 pl-16">
                                <div className="flex items-center space-x-1">
                                  <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                                    Subtheme
                                  </span>
                                  <span className="text-xs text-gray-600">{`ST${
                                    pIndex + 1
                                  }.${tIndex + 1}.${sIndex + 1}`}</span>
                                </div>
                              </td>
                              <td className="px-2 py-2">
                                <div className="text-gray-800">{sub.name}</div>
                                <div className="text-gray-600 text-xs">
                                  {sub.description}
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center">
                                {sub.sort_order}
                              </td>
                              <td className="px-2 py-2 text-right">
                                {editMode ? "—" : ""}
                              </td>
                            </tr>
                          ))}
                      </>
                    ))}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Pillar Modal */}
      {modalType === "add-pillar" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Pillar</h2>
            <label className="block text-sm mb-2">
              Name
              <input
                type="text"
                value={pillarName}
                onChange={(e) => setPillarName(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="block text-sm mb-2">
              Description
              <textarea
                value={pillarDesc}
                onChange={(e) => setPillarDesc(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            <label className="block text-sm mb-4">
              Sort Order
              <input
                type="number"
                value={pillarSort}
                onChange={(e) => setPillarSort(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalType(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPillar}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
