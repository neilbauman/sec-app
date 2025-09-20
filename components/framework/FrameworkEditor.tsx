"use client";

import { useEffect, useState } from "react";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
  addSubtheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
} from "lucide-react";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    type: null | "add-pillar" | "add-theme" | "add-subtheme";
    parentId?: string;
  }>({ type: null });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  // Load framework data
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
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const openModal = (
    type: "add-pillar" | "add-theme" | "add-subtheme",
    parentId?: string
  ) => {
    setModal({ type, parentId });
    setName("");
    setDesc("");
    setModalError(null);
  };

  const closeModal = () => setModal({ type: null });

  const handleSave = async () => {
    if (!modal.type) return;
    setModalError(null);
    try {
      if (modal.type === "add-pillar") {
        await addPillar({
          name,
          description: desc,
          sort_order: pillars.length + 1,
        });
      } else if (modal.type === "add-theme" && modal.parentId) {
        await addTheme({
          pillarId: modal.parentId,
          name,
          description: desc,
        });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        await addSubtheme({
          themeId: modal.parentId,
          name,
          description: desc,
        });
      }
      const data = await fetchFramework();
      setPillars(data);
      closeModal();
    } catch (err) {
      console.error(err);
      setModalError("Failed to save. Please try again.");
    }
  };

  const handleDeletePillar = async (id: string) => {
    if (!confirm("Delete this pillar?")) return;
    try {
      await deletePillar(id);
      const data = await fetchFramework();
      setPillars(data);
    } catch (err) {
      console.error(err);
      alert("Failed to delete pillar.");
    }
  };

  const isOpen = (id: string) => expanded.has(id);

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

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="text-sm px-2 py-1 bg-gray-200 rounded"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-sm px-2 py-1 bg-gray-200 rounded"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={() => openModal("add-pillar")}
                className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
              >
                <Plus className="h-3 w-3 inline" /> Add Pillar
              </button>
            )}
          </div>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="text-sm px-2 py-1 bg-orange-200 rounded"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="w-1/4 px-2 py-1">Type / Ref Code</th>
                <th className="w-2/4 px-2 py-1">Name / Description</th>
                <th className="w-1/8 px-2 py-1 text-center">Sort</th>
                <th className="w-1/8 px-2 py-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, pIndex) => (
                <>
                  <tr
                    key={pillar.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-2 py-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="mr-1"
                      >
                        {isOpen(pillar.id) ? (
                          <ChevronDown className="h-4 w-4 inline" />
                        ) : (
                          <ChevronRight className="h-4 w-4 inline" />
                        )}
                      </button>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                        Pillar
                      </span>{" "}
                      P{pIndex + 1}
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-gray-500">
                        {pillar.description}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {pillar.sort_order}
                    </td>
                    <td className="px-2 py-2 text-right space-x-2">
                      {editMode && (
                        <>
                          <button
                            onClick={() => openModal("add-theme", pillar.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Plus className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeletePillar(pillar.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {isOpen(pillar.id) &&
                    pillar.themes.map((theme, tIndex) => (
                      <>
                        <tr
                          key={theme.id}
                          className="border-b hover:bg-gray-50 text-sm"
                        >
                          <td className="px-6 py-2">
                            <button
                              onClick={() => toggleExpand(theme.id)}
                              className="mr-1"
                            >
                              {isOpen(theme.id) ? (
                                <ChevronDown className="h-4 w-4 inline" />
                              ) : (
                                <ChevronRight className="h-4 w-4 inline" />
                              )}
                            </button>
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                              Theme
                            </span>{" "}
                            T{pIndex + 1}.{tIndex + 1}
                          </td>
                          <td className="px-2 py-2">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-gray-500">
                              {theme.description}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            {theme.sort_order}
                          </td>
                          <td className="px-2 py-2 text-right space-x-2">
                            {editMode && (
                              <>
                                <button
                                  onClick={() =>
                                    openModal("add-subtheme", theme.id)
                                  }
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Plus className="h-4 w-4 inline" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                        {isOpen(theme.id) &&
                          theme.subthemes.map((sub, sIndex) => (
                            <tr
                              key={sub.id}
                              className="border-b hover:bg-gray-50 text-sm"
                            >
                              <td className="px-10 py-2">
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
                                  Subtheme
                                </span>{" "}
                                ST{pIndex + 1}.{tIndex + 1}.{sIndex + 1}
                              </td>
                              <td className="px-2 py-2">
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-xs text-gray-500">
                                  {sub.description}
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center">
                                {sub.sort_order}
                              </td>
                              <td className="px-2 py-2 text-right space-x-2">
                                {editMode && (
                                  <button className="text-red-600 hover:text-red-800">
                                    <Trash2 className="h-4 w-4 inline" />
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
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {modalError && <p className="text-red-600">{modalError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded"
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
