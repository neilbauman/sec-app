// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import { addPillar, addTheme, addSubtheme, deletePillar, deleteTheme, deleteSubtheme } from "@/lib/framework-actions";
import type { Pillar, Theme, Subtheme } from "@/lib/framework-client";

type ModalType = "add-pillar" | "add-theme" | "add-subtheme";

interface ModalState {
  open: boolean;
  type: ModalType | null;
  parentId?: string;
}

export default function FrameworkEditor({ data }: { data: Pillar[] }) {
  const [pillars, setPillars] = useState<Pillar[]>(data);
  const [modal, setModal] = useState<ModalState>({ open: false, type: null });

  const openModal = (type: ModalType, parentId?: string) => setModal({ open: true, type, parentId });
  const closeModal = () => setModal({ open: false, type: null });

  const handleAdd = async (name: string, desc: string) => {
    try {
      if (modal.type === "add-pillar") {
        await addPillar({ name, description: desc, sort_order: pillars.length + 1 });
      } else if (modal.type === "add-theme" && modal.parentId) {
        const parent = pillars.find((p) => p.id === modal.parentId);
        const count = parent?.themes?.length ?? 0;
        await addTheme({
          pillar_id: modal.parentId, // ✅ FIXED: match DB field
          name,
          description: desc,
          sort_order: count + 1,
        });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        const parentTheme = pillars.flatMap((p) => p.themes || []).find((t) => t.id === modal.parentId);
        const count = parentTheme?.subthemes?.length ?? 0;
        await addSubtheme({
          theme_id: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      }
    } catch (err) {
      console.error("Error adding item:", err);
    } finally {
      closeModal();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Framework Editor</h1>
      <button
        onClick={() => openModal("add-pillar")}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add Pillar
      </button>

      <ul className="mt-4 space-y-4">
        {pillars.map((pillar) => (
          <li key={pillar.id} className="border p-2 rounded">
            <div className="flex justify-between">
              <span className="font-semibold">{pillar.name}</span>
              <button
                onClick={() => openModal("add-theme", pillar.id)}
                className="text-sm text-blue-500"
              >
                + Theme
              </button>
            </div>

            <ul className="ml-4 mt-2 space-y-2">
              {pillar.themes?.map((theme) => (
                <li key={theme.id} className="border p-2 rounded">
                  <div className="flex justify-between">
                    <span>{theme.name}</span>
                    <button
                      onClick={() => openModal("add-subtheme", theme.id)}
                      className="text-sm text-green-500"
                    >
                      + Subtheme
                    </button>
                  </div>

                  <ul className="ml-4 mt-1 space-y-1">
                    {theme.subthemes?.map((sub) => (
                      <li key={sub.id} className="text-sm text-gray-700">
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Add {modal.type?.replace("-", " ")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const desc = (form.elements.namedItem("desc") as HTMLInputElement).value;
                handleAdd(name, desc);
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border p-2 rounded w-full mb-2"
                required
              />
              <textarea
                name="desc"
                placeholder="Description"
                className="border p-2 rounded w-full mb-2"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
