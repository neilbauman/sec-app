"use client";

import { useState, useEffect } from "react";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
  addSubtheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
} from "lucide-react";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{
    type: "add-pillar" | "add-theme" | "add-subtheme" | null;
    parentId?: string;
  }>({ type: null });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadFramework();
  }, []);

  async function loadFramework() {
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
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }

  function expandAll() {
    const allIds = new Set<string>();
    pillars.forEach((p) => {
      allIds.add(`pillar-${p.id}`);
      p.themes.forEach((t) => {
        allIds.add(`theme-${t.id}`);
        t.subthemes.forEach((s) => allIds.add(`subtheme-${s.id}`));
      });
    });
    setExpanded(allIds);
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  async function handleDeletePillar(id: string) {
    if (!confirm("Are you sure you want to delete this pillar?")) return;
    await deletePillar(id);
    loadFramework();
  }

  async function handleDeleteTheme(id: string) {
    if (!confirm("Are you sure you want to delete this theme?")) return;
    await deleteTheme(id);
    loadFramework();
  }

  async function handleDeleteSubtheme(id: string) {
    if (!confirm("Are you sure you want to delete this subtheme?")) return;
    await deleteSubtheme(id);
    loadFramework();
  }

  function openModal(type: "add-pillar" | "add-theme" | "add-subtheme", parentId?: string) {
    setModal({ type, parentId });
    setName("");
    setDescription("");
    setModalError(null);
  }

  function closeModal() {
    setModal({ type: null });
    setName("");
    setDescription("");
    setModalError(null);
  }

  async function handleSubmitModal() {
    if (!name.trim()) {
      setModalError("Name is required.");
      return;
    }
    try {
      if (modal.type === "add-pillar") {
        await addPillar({ name, description });
      } else if (modal.type === "add-theme" && modal.parentId) {
        await addTheme({ pillarId: modal.parentId, name, description });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        await addSubtheme({ themeId: modal.parentId, name, description });
      }
      closeModal();
      loadFramework();
    } catch (err) {
      console.error(err);
      setModalError("Failed to save.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={expandAll}
              className="px-2 py-1 text-sm border rounded"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2 py-1 text-sm border rounded"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={() => openModal("add-pillar")}
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add Pillar</span>
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-sm border rounded flex items-center space-x-1">
              <Upload size={14} />
              <span>Upload CSV</span>
            </button>
            <button className="px-2 py-1 text-sm border rounded flex items-center space-x-1">
              <Download size={14} />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="px-2 py-1 text-sm bg-orange-200 text-orange-800 rounded"
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
              <tr className="border-b bg-gray-50 text-left text-sm font-semibold">
                <th className="w-[20%] px-2 py-2">Type / Ref Code</th>
                <th className="w-[55%] px-2 py-2">Name / Description</th>
                <th className="w-[15%] px-2 py-2 text-center">Sort Order</th>
                <th className="w-[10%] px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, pIndex) => (
                <>
                  <tr key={pillar.id} className="border-b">
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-1">
                        {pillar.themes.length > 0 && (
                          <button onClick={() => toggleExpand(`pillar-${pillar.id}`)}>
                            {expanded.has(`pillar-${pillar.id}`) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                        )}
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          Pillar
                        </span>
                        <span className="text-sm font-mono">P{pIndex + 1}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-gray-500">{pillar.description}</div>
                    </td>
                    <td className="px-2 py-2 text-center">{pillar.sort_order}</td>
                    <td className="px-2 py-2 text-right space-x-2">
                      {editMode && (
                        <>
                          <button
                            onClick={() => openModal("add-theme", pillar.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePillar(pillar.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {expanded.has(`pillar-${pillar.id}`) &&
                    pillar.themes.map((theme, tIndex) => (
                      <>
                        <tr key={theme.id} className="border-b bg-gray-50">
                          <td className="px-2 py-2 pl-6">
                            <div className="flex items-center space-x-1">
                              {theme.subthemes.length > 0 && (
                                <button onClick={() => toggleExpand(`theme-${theme.id}`)}>
                                  {expanded.has(`theme-${theme.id}`) ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </button>
                              )}
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                                Theme
                              </span>
                              <span className="text-sm font-mono">
                                T{pIndex + 1}.{tIndex + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-gray-500">{theme.description}</div>
                          </td>
                          <td className="px-2 py-2 text-center">{theme.sort_order}</td>
                          <td className="px-2 py-2 text-right space-x-2">
                            {editMode && (
                              <>
                                <button
                                  onClick={() => openModal("add-subtheme", theme.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Plus size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTheme(theme.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expanded.has(`theme-${theme.id}`) &&
                          theme.subthemes.map((sub, sIndex) => (
                            <tr key={sub.id} className="border-b">
                              <td className="px-2 py-2 pl-12">
                                <div className="flex items-center space-x-1">
                                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                                    Subtheme
                                  </span>
                                  <span className="text-sm font-mono">
                                    ST{pIndex + 1}.{tIndex + 1}.{sIndex + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 py-2">
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-xs text-gray-500">{sub.description}</div>
                              </td>
                              <td className="px-2 py-2 text-center">{sub.sort_order}</td>
                              <td className="px-2 py-2 text-right space-x-2">
                                {editMode && (
                                  <button
                                    onClick={() => handleDeleteSubtheme(sub.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
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

      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {modal.type === "add-pillar"
                ? "Add Pillar"
                : modal.type === "add-theme"
                ? "Add Theme"
                : "Add Subtheme"}
            </h2>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
            {modalError && <p className="text-red-600 text-sm">{modalError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitModal}
                className="px-3 py-1 bg-blue-600 text-white rounded"
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
