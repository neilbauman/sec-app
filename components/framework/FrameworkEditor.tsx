"use client";

import { useEffect, useState } from "react";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
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

type ModalType =
  | "add-pillar"
  | "delete-pillar"
  | "add-theme"
  | "delete-theme"
  | "delete-subtheme";

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
  const [targetId, setTargetId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Add Pillar fields
  const [pillarName, setPillarName] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");

  // Add Theme fields
  const [themeName, setThemeName] = useState("");
  const [themeDesc, setThemeDesc] = useState("");

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

  const openModal = (type: ModalType, id?: string) => {
    setModalType(type);
    setTargetId(id ?? null);
    setModalError(null);
  };

  const closeModal = () => {
    setModalType(null);
    setTargetId(null);
    setPillarName("");
    setPillarDesc("");
    setThemeName("");
    setThemeDesc("");
    setModalError(null);
  };

  const reload = async () => {
    const data = await fetchFramework();
    setPillars(data);
  };

  const handleAddPillar = async () => {
    try {
      setModalError(null);
      const maxSort = Math.max(0, ...pillars.map((p) => p.sort_order));
      await addPillar({
        name: pillarName.trim(),
        description: pillarDesc.trim(),
        sort_order: maxSort + 1,
      });
      closeModal();
      reload();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Failed to add pillar.");
    }
  };

  const handleAddTheme = async () => {
    if (!targetId) return;
    try {
      setModalError(null);
      const pillar = pillars.find((p) => p.id === targetId);
      const maxSort =
        pillar && pillar.themes.length > 0
          ? Math.max(...pillar.themes.map((t) => t.sort_order))
          : 0;

      await addTheme({
        pillar_id: targetId,
        name: themeName.trim(),
        description: themeDesc.trim(),
        sort_order: maxSort + 1,
      });
      closeModal();
      reload();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Failed to add theme.");
    }
  };

  const handleDelete = async () => {
    if (!modalType || !targetId) return;
    try {
      setModalError(null);
      if (modalType === "delete-pillar") await deletePillar(targetId);
      if (modalType === "delete-theme") await deleteTheme(targetId);
      if (modalType === "delete-subtheme") await deleteSubtheme(targetId);
      closeModal();
      reload();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Delete failed.");
    }
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expanded);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpanded(newSet);
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
        <div className="flex justify-between mb-3">
          <div className="space-x-2">
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
                onClick={() => openModal("add-pillar")}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b">
            <tr className="text-left text-gray-600">
              <th className="w-1/5 px-4 py-2">Type / Ref Code</th>
              <th className="w-3/5 px-4 py-2">Name / Description</th>
              <th className="w-1/10 px-4 py-2 text-center">Sort Order</th>
              <th className="w-1/10 px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <>
                <tr key={pillar.id} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => toggleExpand(pillar.id)}>
                        {expanded.has(pillar.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        Pillar
                      </span>
                      <span className="text-xs">P{pillar.sort_order}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-semibold">{pillar.name}</div>
                    <div className="text-gray-500 text-xs">{pillar.description}</div>
                  </td>
                  <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {editMode && (
                      <>
                        <button
                          onClick={() => openModal("add-theme", pillar.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Plus className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => openModal("delete-pillar", pillar.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {expanded.has(pillar.id) &&
                  pillar.themes.map((theme) => (
                    <tr key={theme.id} className="border-b bg-gray-50">
                      <td className="px-8 py-2">
                        <div className="flex items-center space-x-1">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                            Theme
                          </span>
                          <span className="text-xs">
                            T{pillar.sort_order}.{theme.sort_order}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-gray-500 text-xs">{theme.description}</div>
                      </td>
                      <td className="px-4 py-2 text-center">{theme.sort_order}</td>
                      <td className="px-4 py-2 text-right">
                        {editMode && (
                          <button
                            onClick={() => openModal("delete-theme", theme.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {modalType && modalType.startsWith("delete") && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this{" "}
              {modalType.replace("delete-", "")}? This action cannot be undone.
            </p>
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Pillar Modal */}
      {modalType === "add-pillar" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="font-semibold mb-2">Add Pillar</h3>
            <div className="space-y-2 mb-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={pillarName}
                  onChange={(e) => setPillarName(e.target.value)}
                  className="border w-full px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                  className="border w-full px-2 py-1 rounded text-sm"
                />
              </div>
            </div>
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPillar}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Theme Modal */}
      {modalType === "add-theme" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="font-semibold mb-2">Add Theme</h3>
            <div className="space-y-2 mb-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className="border w-full px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={themeDesc}
                  onChange={(e) => setThemeDesc(e.target.value)}
                  className="border w-full px-2 py-1 rounded text-sm"
                />
              </div>
            </div>
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTheme}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
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
