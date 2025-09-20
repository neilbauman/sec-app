"use client";

import { useEffect, useState } from "react";
import { fetchFramework, Pillar, Theme, Subtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  FileDown,
  FileUp,
} from "lucide-react";

// -----------------------------
// Modal Types
// -----------------------------
type ModalType = "add-pillar" | "add-theme" | "add-subtheme";

// -----------------------------
// Main Component
// -----------------------------
export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{ type: ModalType; parentId?: string } | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadFramework();
  }, []);

  async function loadFramework() {
    const data = await fetchFramework();
    setPillars(data);
  }

  function toggleExpand(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }

  function openModal(type: ModalType, parentId?: string) {
    setModal({ type, parentId });
    setName("");
    setDesc("");
    setModalError(null);
  }

  function closeModal() {
    setModal(null);
    setName("");
    setDesc("");
    setModalError(null);
  }

  async function handleSave() {
    if (!modal) return;
    setModalError(null);

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
          pillarId: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      } else if (modal.type === "add-subtheme" && modal.parentId) {
        let parentTheme: Theme | undefined;
        for (const pillar of pillars) {
          parentTheme = pillar.themes.find((t) => t.id === modal.parentId);
          if (parentTheme) break;
        }
        const count = parentTheme?.subthemes?.length ?? 0;
        await addSubtheme({
          themeId: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      }
      closeModal();
      await loadFramework();
    } catch (err: any) {
      setModalError(err.message || "Failed to save.");
    }
  }

  return (
    <div className="p-4">
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
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
              onClick={() => openModal("add-pillar")}
              className="px-2 py-1 rounded text-white bg-blue-600 text-sm"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add Pillar
            </button>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="px-2 py-1 border rounded text-sm">
            <FileUp className="h-4 w-4 inline mr-1" />
            Upload CSV
          </button>
          <button className="px-2 py-1 border rounded text-sm">
            <FileDown className="h-4 w-4 inline mr-1" />
            Download CSV
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-2 py-1 rounded text-white bg-orange-600 text-sm"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="w-1/5 px-2 py-2">Type / Ref Code</th>
            <th className="w-3/5 px-2 py-2">Name / Description</th>
            <th className="w-1/10 px-2 py-2 text-center">Sort Order</th>
            <th className="w-1/5 px-2 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar, i) => (
            <PillarRow
              key={pillar.id}
              pillar={pillar}
              expanded={expanded}
              toggleExpand={toggleExpand}
              editMode={editMode}
              openModal={openModal}
              confirmDelete={deletePillar}
            />
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modal && (
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
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            {modalError && <p className="text-red-600">{modalError}</p>}
            <div className="flex justify-end space-x-2">
              <button onClick={closeModal} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button
                onClick={handleSave}
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

// -----------------------------
// Row Components
// -----------------------------
function PillarRow({
  pillar,
  expanded,
  toggleExpand,
  editMode,
  openModal,
  confirmDelete,
}: {
  pillar: Pillar;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  openModal: (type: ModalType, parentId?: string) => void;
  confirmDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(pillar.id);
  const refCode = `P${pillar.sort_order}`;

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pr-2 pl-4">
          <button onClick={() => toggleExpand(pillar.id)} className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
            Pillar
          </span>{" "}
          <span className="text-xs text-gray-600">{refCode}</span>
        </td>
        <td className="py-2">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-gray-600 text-sm">{pillar.description}</div>
        </td>
        <td className="py-2 text-center">{pillar.sort_order}</td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => openModal("add-theme", pillar.id)}
              >
                <Plus className="h-4 w-4 inline" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => confirmDelete(pillar.id)}
              >
                <Trash2 className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>
      {isOpen &&
        pillar.themes.map((theme) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            expanded={expanded}
            toggleExpand={toggleExpand}
            editMode={editMode}
            openModal={openModal}
            confirmDelete={deleteTheme}
          />
        ))}
    </>
  );
}

function ThemeRow({
  theme,
  expanded,
  toggleExpand,
  editMode,
  openModal,
  confirmDelete,
}: {
  theme: Theme;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  openModal: (type: ModalType, parentId?: string) => void;
  confirmDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(theme.id);
  const refCode = `T${theme.sort_order}`;

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2 pl-8">
          <button onClick={() => toggleExpand(theme.id)} className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
            Theme
          </span>{" "}
          <span className="text-xs text-gray-600">{refCode}</span>
        </td>
        <td className="py-2">
          <div className="font-medium">{theme.name}</div>
          <div className="text-gray-600 text-sm">{theme.description}</div>
        </td>
        <td className="py-2 text-center">{theme.sort_order}</td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => openModal("add-subtheme", theme.id)}
              >
                <Plus className="h-4 w-4 inline" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => confirmDelete(theme.id)}
              >
                <Trash2 className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>
      {isOpen &&
        theme.subthemes.map((sub) => (
          <SubthemeRow
            key={sub.id}
            sub={sub}
            editMode={editMode}
            openModal={openModal}
            confirmDelete={deleteSubtheme}
          />
        ))}
    </>
  );
}

function SubthemeRow({
  sub,
  editMode,
  openModal,
  confirmDelete,
}: {
  sub: Subtheme;
  editMode: boolean;
  openModal: (type: ModalType, parentId?: string) => void;
  confirmDelete: (id: string) => void;
}) {
  const refCode = `ST${sub.sort_order}`;

  return (
    <tr className="border-b">
      <td className="py-2 pr-2 pl-12">
        <span className="inline-block px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
          Subtheme
        </span>{" "}
        <span className="text-xs text-gray-600">{refCode}</span>
      </td>
      <td className="py-2">
        <div className="font-medium">{sub.name}</div>
        <div className="text-gray-600 text-sm">{sub.description}</div>
      </td>
      <td className="py-2 text-center">{sub.sort_order}</td>
      <td className="py-2 text-right space-x-2">
        {editMode && (
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => confirmDelete(sub.id)}
          >
            <Trash2 className="h-4 w-4 inline" />
          </button>
        )}
      </td>
    </tr>
  );
}
