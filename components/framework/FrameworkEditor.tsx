"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  addPillar,
  updatePillar,
  deletePillar,
  addTheme,
  addSubtheme,
} from "@/lib/framework-actions";
import { Plus, Edit, Trash2, Upload, Download } from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add-pillar" | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Pillar form inputs
  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");

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

  // Handle Add Pillar
  async function handleAddPillar() {
    setModalError(null);
    try {
      await addPillar({
        name: pillarName.trim(),
        description: pillarDesc.trim(),
        sort_order: 999, // temporary placeholder
      });
      setModalOpen(false);
      setPillarName("");
      setPillarDesc("");

      // reload
      const data = await fetchFramework();
      setPillars(data);
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Failed to add pillar.");
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
            <button className="px-3 py-1 text-sm border rounded">
              Expand All
            </button>
            <button className="px-3 py-1 text-sm border rounded">
              Collapse All
            </button>
          </div>
          <div className="space-x-2 flex items-center">
            <Upload className="h-4 w-4 text-gray-500 cursor-pointer" />
            <Download className="h-4 w-4 text-gray-500 cursor-pointer" />
            <button
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
              onClick={() => {
                setModalType("add-pillar");
                setModalOpen(true);
              }}
            >
              + Add Pillar
            </button>
            <button
              className="bg-orange-200 text-orange-800 text-sm px-3 py-1 rounded"
              onClick={() => setEditMode(!editMode)}
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
                <th className="w-[20%] text-left py-2">Type / Ref Code</th>
                <th className="w-[55%] text-left py-2">Name / Description</th>
                <th className="w-[15%] text-center py-2">Sort Order</th>
                <th className="w-[10%] text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, i) => (
                <tr key={pillar.id} className="border-b">
                  <td className="py-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                      Pillar
                    </span>{" "}
                    P{i + 1}
                  </td>
                  <td className="py-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-sm text-gray-500">
                      {pillar.description}
                    </div>
                  </td>
                  <td className="py-2 text-center">{pillar.sort_order}</td>
                  <td className="py-2 text-right space-x-2">
                    {editMode && (
                      <>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Pillar Modal */}
      {modalOpen && modalType === "add-pillar" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Add Pillar</h2>

            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={pillarName}
                onChange={(e) => setPillarName(e.target.value)}
                className="mt-1 w-full border rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={pillarDesc}
                onChange={(e) => setPillarDesc(e.target.value)}
                className="mt-1 w-full border rounded p-2 text-sm"
              />
            </div>

            {modalError && (
              <p className="text-red-600 text-sm">{modalError}</p>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 text-sm border rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddPillar}
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
