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
  Upload,
  Download,
} from "lucide-react";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    type: "add-pillar" | "add-theme" | "add-subtheme" | null;
    parentId?: string;
  }>({ type: null });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  // Fetch framework data
  useEffect(() => {
    (async () => {
      const data = await fetchFramework();
      setPillars(data);
    })();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    pillars.forEach((p) => {
      all.add(p.id);
      p.themes.forEach((t) => {
        all.add(t.id);
        t.subthemes.forEach((s) => all.add(s.id));
      });
    });
    setExpanded(all);
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

  const closeModal = () => {
    setModal({ type: null });
    setName("");
    setDesc("");
    setModalError(null);
  };

  const handleSubmit = async () => {
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
        let parentTheme;
        for (const pillar of pillars) {
          const t = pillar.themes.find((t) => t.id === modal.parentId);
          if (t) {
            parentTheme = t;
            break;
          }
        }
        const count = parentTheme?.subthemes?.length ?? 0;
        await addSubtheme({
          themeId: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
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

  return (
    <div className="p-4">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={expandAll}
          >
            Expand All
          </button>
          <button
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={collapseAll}
          >
            Collapse All
          </button>
          {editMode && (
            <button
              className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => openModal("add-pillar")}
            >
              + Add Pillar
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-gray-100">
            <Upload className="h-4 w-4" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Download className="h-4 w-4" />
          </button>
          <button
            className="text-sm px-3 py-1 rounded bg-orange-200 hover:bg-orange-300"
            onClick={() => setEditMode((e) => !e)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="w-1/5 px-2 py-2">Type</th>
            <th className="w-3/5 px-2 py-2">Name / Description</th>
            <th className="w-1/5 px-2 py-2 text-center">Sort</th>
            <th className="w-1/5 px-2 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar) => (
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
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full border rounded px-3 py-2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            {modalError && <p className="text-red-600">{modalError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
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

// --- Row Components ---
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
  openModal: (type: "add-theme", parentId: string) => void;
  confirmDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(pillar.id);
  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="px-2 py-2">
          <button onClick={() => toggleExpand(pillar.id)}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <span className="ml-2 font-semibold text-blue-600">Pillar</span>
        </td>
        <td className="px-2 py-2">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-sm text-gray-600">{pillar.description}</div>
        </td>
        <td className="px-2 py-2 text-center">{pillar.sort_order}</td>
        <td className="px-2 py-2 text-right space-x-2">
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
  theme: any;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  openModal: (type: "add-subtheme", parentId: string) => void;
  confirmDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(theme.id);
  return (
    <>
      <tr className="border-b">
        <td className="px-6 py-2">
          <button onClick={() => toggleExpand(theme.id)}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <span className="ml-2 text-green-600">Theme</span>
        </td>
        <td className="px-2 py-2">
          <div className="font-medium">{theme.name}</div>
          <div className="text-sm text-gray-600">{theme.description}</div>
        </td>
        <td className="px-2 py-2 text-center">{theme.sort_order}</td>
        <td className="px-2 py-2 text-right space-x-2">
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
        theme.subthemes.map((sub: any) => (
          <SubthemeRow
            key={sub.id}
            sub={sub}
            editMode={editMode}
            confirmDelete={deleteSubtheme}
          />
        ))}
    </>
  );
}

function SubthemeRow({
  sub,
  editMode,
  confirmDelete,
}: {
  sub: any;
  editMode: boolean;
  confirmDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b">
      <td className="px-10 py-2">
        <span className="text-red-600">Subtheme</span>
      </td>
      <td className="px-2 py-2">
        <div className="font-medium">{sub.name}</div>
        <div className="text-sm text-gray-600">{sub.description}</div>
      </td>
      <td className="px-2 py-2 text-center">{sub.sort_order}</td>
      <td className="px-2 py-2 text-right space-x-2">
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
