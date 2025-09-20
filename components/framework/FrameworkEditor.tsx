"use client";

import { useState } from "react";
import { addPillar, deletePillar, addTheme, deleteTheme, addSubtheme, deleteSubtheme } from "@/lib/framework-actions";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Minus, Trash2, Edit3 } from "lucide-react";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<{ type: string; parentId?: string } | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Load data
  const loadData = async () => {
    const data = await fetchFramework();
    setPillars(data);
  };

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open modal
  const openModal = (type: string, parentId?: string) => {
    setModal({ type, parentId });
    setName("");
    setDesc("");
  };

  // Handle save
  const handleSave = async () => {
    if (!modal) return;
    if (modal.type === "add-pillar") {
      await addPillar({
        name,
        description: desc,
        sort_order: pillars.length + 1,
      });
    } else if (modal.type === "add-theme" && modal.parentId) {
      const parent = pillars.find((p) => p.id === modal.parentId);
      const count = parent?.themes?.length ?? 0;
      await addTheme({
        pillarId: modal.parentId,
        name,
        description: desc,
        sort_order: count + 1,
      });
    } else if (modal.type === "add-subtheme" && modal.parentId) {
      const parentTheme = pillars
        .flatMap((p) => p.themes)
        .find((t) => t.id === modal.parentId);
      const count = parentTheme?.subthemes?.length ?? 0;
      await addSubtheme({
        themeId: modal.parentId,
        name,
        description: desc,
        sort_order: count + 1,
      });
    }
    setModal(null);
    await loadData();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <PageHeader
        title="Primary Framework Editor"
        description="Define and manage pillars, themes, and subthemes of the SSC framework."
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary" },
        ]}
      />

      {/* Controls */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="px-3 py-1 text-sm bg-gray-200 rounded flex items-center space-x-1"
        >
          <Edit3 className="w-4 h-4" />
          <span>{editMode ? "Exit Edit Mode" : "Enter Edit Mode"}</span>
        </button>

        {editMode && (
          <button
            onClick={() => openModal("add-pillar")}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pillar</span>
          </button>
        )}
      </div>

      {/* Pillar List */}
      <div className="space-y-4">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => toggleExpand(pillar.id)}
                  className="mr-2 text-sm"
                >
                  {expanded[pillar.id] ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                <span className="font-semibold">{pillar.name}</span>
              </div>
              {editMode && (
                <button
                  onClick={async () => {
                    await deletePillar(pillar.id);
                    await loadData();
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {expanded[pillar.id] && (
              <div className="ml-6 mt-2 space-y-2">
                {pillar.themes?.map((theme) => (
                  <div key={theme.id} className="border-l pl-2">
                    <div className="flex items-center justify-between">
                      <span>{theme.name}</span>
                      {editMode && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal("add-subtheme", theme.id)}
                            className="text-blue-500 text-sm"
                          >
                            + Subtheme
                          </button>
                          <button
                            onClick={async () => {
                              await deleteTheme(theme.id);
                              await loadData();
                            }}
                            className="text-red-500 text-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 space-y-1">
                      {theme.subthemes?.map((sub) => (
                        <div key={sub.id} className="flex justify-between">
                          <span className="text-sm">{sub.name}</span>
                          {editMode && (
                            <button
                              onClick={async () => {
                                await deleteSubtheme(sub.id);
                                await loadData();
                              }}
                              className="text-red-500 text-xs"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {editMode && (
                  <button
                    onClick={() => openModal("add-theme", pillar.id)}
                    className="mt-2 text-blue-500 text-sm"
                  >
                    + Theme
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold capitalize">
              {modal.type.replace("-", " ")}
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModal(null)}
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
