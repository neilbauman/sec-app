// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
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
import { Plus, Minus, Edit, Trash } from "lucide-react";

export default function FrameworkEditor({ data }: { data: Pillar[] }) {
  const [pillars, setPillars] = useState<Pillar[]>(data);
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{
    type: "add-pillar" | "add-theme" | "add-subtheme" | null;
    parentId?: string;
  }>({ type: null });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const openModal = (type: "add-pillar" | "add-theme" | "add-subtheme", parentId?: string) => {
    setModal({ type, parentId });
    setName("");
    setDesc("");
    setModalError(null);
  };

  const closeModal = () => setModal({ type: null });

  const handleSave = async () => {
    try {
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
          pillarId: modal.parentId, // ✅ FIXED to camelCase
          name,
          description: desc,
          sort_order: count + 1,
        });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        const parentTheme = pillars.flatMap((p) => p.themes ?? []).find((t) => t.id === modal.parentId);
        const count = parentTheme?.subthemes?.length ?? 0;
        await addSubtheme({
          themeId: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      }
      // Refresh after insert
      const fresh = await fetchFramework();
      setPillars(fresh);
      closeModal();
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Primary Framework Editor"
        description="Define and manage pillars, themes, and subthemes of the SSC framework."
      />
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="px-3 py-1 text-sm rounded bg-orange-200 hover:bg-orange-300"
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
        {editMode && (
          <button
            onClick={() => openModal("add-pillar")}
            className="px-3 py-1 text-sm rounded bg-blue-200 hover:bg-blue-300 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Pillar
          </button>
        )}
      </div>

      {/* Pillars */}
      <div className="divide-y border rounded bg-white">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="p-3">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{pillar.name}</div>
                <div className="text-sm text-gray-600">{pillar.description}</div>
              </div>
              {editMode && (
                <button
                  onClick={() => deletePillar(pillar.id).then(() => fetchFramework().then(setPillars))}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="ml-6 mt-2 space-y-2">
              {pillar.themes?.map((theme) => (
                <div key={theme.id} className="border-l pl-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-sm text-gray-500">{theme.description}</div>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => deleteTheme(theme.id).then(() => fetchFramework().then(setPillars))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="ml-6 mt-2 space-y-1">
                    {theme.subthemes?.map((sub) => (
                      <div key={sub.id} className="flex justify-between">
                        <div>
                          <div className="text-sm">{sub.name}</div>
                          <div className="text-xs text-gray-500">{sub.description}</div>
                        </div>
                        {editMode && (
                          <button
                            onClick={() => deleteSubtheme(sub.id).then(() => fetchFramework().then(setPillars))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => openModal("add-subtheme", theme.id)}
                        className="text-green-600 hover:text-green-800 text-sm flex items-center"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Subtheme
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => openModal("add-theme", pillar.id)}
                  className="text-green-600 hover:text-green-800 text-sm flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Theme
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border rounded px-2 py-1"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="w-full border rounded px-2 py-1"
            />
            {modalError && <div className="text-red-600 text-sm">{modalError}</div>}
            <div className="flex justify-end space-x-2">
              <button onClick={closeModal} className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
