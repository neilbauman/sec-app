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
import PageHeader from "@/components/ui/PageHeader";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
} from "lucide-react";

// -----------------------------
// Types
// -----------------------------
type Subtheme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

type Theme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
};

type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

// -----------------------------
// Main Component
// -----------------------------
export default function FrameworkEditor({
  data,
}: {
  data: Pillar[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<null | {
    type: "add-pillar" | "add-theme" | "add-subtheme";
    parentId?: string;
  }>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  function toggleExpand(id: string) {
    const newSet = new Set(expanded);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpanded(newSet);
  }

  function handleOpenModal(type: "add-pillar" | "add-theme" | "add-subtheme", parentId?: string) {
    setModal({ type, parentId });
    setModalError(null);
  }

  function handleCloseModal() {
    setModal(null);
    setModalError(null);
  }

  async function handleSaveModal(name: string, description: string) {
    if (!modal) return;

    try {
      if (modal.type === "add-pillar") {
        await addPillar({ name, description });
      } else if (modal.type === "add-theme" && modal.parentId) {
        await addTheme({ pillarId: modal.parentId, name, description });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        await addSubtheme({ themeId: modal.parentId, name, description });
      }
      handleCloseModal();
      window.location.reload(); // crude but ensures fresh state
    } catch (err: any) {
      setModalError(err.message || "Failed to save");
    }
  }

  return (
    <div>
      <PageHeader
        title="Primary Framework Editor"
        description="Define and manage pillars, themes, and subthemes of the SSC framework."
      />

      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setExpanded(new Set(data.map((p) => p.id)))}
            className="px-3 py-1 border rounded text-sm"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpanded(new Set())}
            className="px-3 py-1 border rounded text-sm"
          >
            Collapse All
          </button>
          {editMode && (
            <button
              onClick={() => handleOpenModal("add-pillar")}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              + Add Pillar
            </button>
          )}
        </div>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded text-sm">
            <Upload className="w-4 h-4 inline" /> Upload CSV
          </button>
          <button className="px-3 py-1 border rounded text-sm">
            <Download className="w-4 h-4 inline" /> Download CSV
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1 bg-orange-200 text-orange-800 rounded text-sm"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="w-1/4 px-4 py-2">Type / Ref Code</th>
              <th className="w-2/4 px-4 py-2">Name / Description</th>
              <th className="w-1/8 px-4 py-2 text-center">Sort Order</th>
              <th className="w-1/8 px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((pillar, i) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  editMode={editMode}
                  onAddTheme={(pillarId) =>
                    handleOpenModal("add-theme", pillarId)
                  }
                  onDelete={async () => {
                    await deletePillar(pillar.id);
                    window.location.reload();
                  }}
                />
              ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          type={modal.type}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
          error={modalError}
        />
      )}
    </div>
  );
}

// -----------------------------
// Pillar Row
// -----------------------------
function PillarRow({
  pillar,
  expanded,
  toggleExpand,
  editMode,
  onAddTheme,
  onDelete,
}: {
  pillar: Pillar;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  onAddTheme: (pillarId: string) => void;
  onDelete: () => void;
}) {
  const isOpen = expanded.has(pillar.id);
  const refCode = `P${pillar.sort_order}`;

  return (
    <>
      <tr className="border-t">
        <td className="px-4 py-2">
          <div className="flex items-center gap-1">
            {pillar.themes.length > 0 && (
              <button onClick={() => toggleExpand(pillar.id)}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
              Pillar
            </span>
            <span className="text-sm text-gray-600">{refCode}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-sm text-gray-600">{pillar.description}</div>
        </td>
        <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
        <td className="px-4 py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                onClick={() => onAddTheme(pillar.id)}
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="h-4 w-4 inline" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>

      {isOpen &&
        pillar.themes
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((theme) => (
            <ThemeRow
              key={theme.id}
              theme={theme}
              expanded={expanded}
              toggleExpand={toggleExpand}
              editMode={editMode}
            />
          ))}
    </>
  );
}

// -----------------------------
// Theme Row
// -----------------------------
function ThemeRow({
  theme,
  expanded,
  toggleExpand,
  editMode,
}: {
  theme: Theme;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
}) {
  const isOpen = expanded.has(theme.id);
  const refCode = `T${theme.sort_order}`;

  return (
    <>
      <tr className="border-t bg-gray-50">
        <td className="px-8 py-2">
          <div className="flex items-center gap-1">
            {theme.subthemes.length > 0 && (
              <button onClick={() => toggleExpand(theme.id)}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              Theme
            </span>
            <span className="text-sm text-gray-600">{refCode}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <div className="font-medium">{theme.name}</div>
          <div className="text-sm text-gray-600">{theme.description}</div>
        </td>
        <td className="px-4 py-2 text-center">{theme.sort_order}</td>
        <td className="px-4 py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                onClick={() =>
                  handleOpenModal("add-subtheme", theme.id)
                }
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>

      {isOpen &&
        theme.subthemes
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((sub) => (
            <SubthemeRow key={sub.id} sub={sub} editMode={editMode} />
          ))}
    </>
  );
}

// -----------------------------
// Subtheme Row
// -----------------------------
function SubthemeRow({ sub, editMode }: { sub: Subtheme; editMode: boolean }) {
  const refCode = `ST${sub.sort_order}`;
  return (
    <tr className="border-t">
      <td className="px-12 py-2">
        <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
          Subtheme
        </span>
        <span className="text-sm text-gray-600 ml-1">{refCode}</span>
      </td>
      <td className="px-4 py-2">
        <div className="font-medium">{sub.name}</div>
        <div className="text-sm text-gray-600">{sub.description}</div>
      </td>
      <td className="px-4 py-2 text-center">{sub.sort_order}</td>
      <td className="px-4 py-2 text-right space-x-2">
        {editMode && (
          <button
            onClick={async () => {
              await deleteSubtheme(sub.id);
              window.location.reload();
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4 inline" />
          </button>
        )}
      </td>
    </tr>
  );
}

// -----------------------------
// Modal
// -----------------------------
function Modal({
  type,
  onClose,
  onSave,
  error,
}: {
  type: "add-pillar" | "add-theme" | "add-subtheme";
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), desc.trim());
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          {type === "add-pillar"
            ? "Add Pillar"
            : type === "add-theme"
            ? "Add Theme"
            : "Add Subtheme"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
