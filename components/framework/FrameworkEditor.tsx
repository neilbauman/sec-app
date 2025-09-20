"use client";

import { useEffect, useState } from "react";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
  addSubtheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

// -----------------------------
// Main Component
// -----------------------------
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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add-pillar" | "add-theme" | "add-subtheme" | null>(null);
  const [modalTarget, setModalTarget] = useState<any>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadFramework();
  }, []);

  async function loadFramework() {
    setLoading(true);
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

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    const allIds: string[] = [];
    pillars.forEach((p) => {
      allIds.push(p.id);
      p.themes.forEach((t) => {
        allIds.push(t.id);
        t.subthemes.forEach((s) => allIds.push(s.id));
      });
    });
    setExpanded(new Set(allIds));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  function openModal(type: typeof modalType, target?: any) {
    setModalType(type);
    setModalTarget(target ?? null);
    setModalError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalType(null);
    setModalTarget(null);
    setModalError(null);
  }

  // -----------------------------
  // Save handlers with error handling
  // -----------------------------
  async function handleSavePillar(name: string, description: string) {
    setModalError(null);
    const sort_order = (pillars.length || 0) + 1;
    const result = await addPillar({ name, description, sort_order });
    if (!result.success) {
      setModalError(result.message);
      return;
    }
    closeModal();
    loadFramework();
  }

  async function handleSaveTheme(name: string, description: string) {
    if (!modalTarget) return;
    setModalError(null);
    const sort_order = (modalTarget.themes?.length || 0) + 1;
    const result = await addTheme({
      pillar_id: modalTarget.id,
      name,
      description,
      sort_order,
    });
    if (!result.success) {
      setModalError(result.message);
      return;
    }
    closeModal();
    loadFramework();
  }

  async function handleSaveSubtheme(name: string, description: string) {
    if (!modalTarget) return;
    setModalError(null);
    const sort_order = (modalTarget.subthemes?.length || 0) + 1;
    const result = await addSubtheme({
      theme_id: modalTarget.id,
      name,
      description,
      sort_order,
    });
    if (!result.success) {
      setModalError(result.message);
      return;
    }
    closeModal();
    loadFramework();
  }

  // -----------------------------
  // Delete handlers
  // -----------------------------
  async function handleDeletePillar(id: string) {
    await deletePillar(id);
    loadFramework();
  }

  async function handleDeleteTheme(id: string) {
    await deleteTheme(id);
    loadFramework();
  }

  async function handleDeleteSubtheme(id: string) {
    await deleteSubtheme(id);
    loadFramework();
  }

  // -----------------------------
  // Render
  // -----------------------------
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

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-2 py-1 border rounded text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2 py-1 border rounded text-sm"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={() => openModal("add-pillar")}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm"
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 font-semibold text-sm border-b pb-2">
          <div className="col-span-4">Type / Ref Code</div>
          <div className="col-span-6">Name / Description</div>
          <div className="col-span-1 text-center">Sort Order</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading &&
          !error &&
          pillars.map((pillar, pIndex) => (
            <div key={pillar.id} className="border-b">
              <RowPillar
                pillar={pillar}
                index={pIndex}
                expanded={expanded}
                toggleExpand={toggleExpand}
                editMode={editMode}
                openModal={openModal}
                handleDelete={handleDeletePillar}
              />
            </div>
          ))}
      </div>

      {/* Modal */}
      {showModal && modalType && (
        <Modal
          type={modalType}
          onClose={closeModal}
          onSave={
            modalType === "add-pillar"
              ? handleSavePillar
              : modalType === "add-theme"
              ? handleSaveTheme
              : handleSaveSubtheme
          }
          error={modalError}
        />
      )}
    </div>
  );
}

// -----------------------------
// Row Components
// -----------------------------
function RowPillar({
  pillar,
  index,
  expanded,
  toggleExpand,
  editMode,
  openModal,
  handleDelete,
}: {
  pillar: Pillar;
  index: number;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  openModal: (type: any, target?: any) => void;
  handleDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(pillar.id);
  return (
    <>
      <div className="grid grid-cols-12 py-2 items-center">
        <div className="col-span-4 flex items-center gap-2">
          <button onClick={() => toggleExpand(pillar.id)}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
            Pillar
          </span>
          <span className="text-sm font-mono">{`P${pillar.sort_order}`}</span>
        </div>
        <div className="col-span-6">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-xs text-gray-600">{pillar.description}</div>
        </div>
        <div className="col-span-1 text-center">{pillar.sort_order}</div>
        <div className="col-span-1 text-center">
          {editMode && (
            <>
              <button
                onClick={() => openModal("add-theme", pillar)}
                className="text-green-600 hover:text-green-800"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => handleDelete(pillar.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      {isOpen &&
        pillar.themes.map((theme, tIndex) => (
          <RowTheme
            key={theme.id}
            theme={theme}
            pillarIndex={index}
            expanded={expanded}
            toggleExpand={toggleExpand}
            editMode={editMode}
            openModal={openModal}
            handleDelete={handleDeleteTheme}
          />
        ))}
    </>
  );
}

function RowTheme({
  theme,
  pillarIndex,
  expanded,
  toggleExpand,
  editMode,
  openModal,
  handleDelete,
}: {
  theme: any;
  pillarIndex: number;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
  openModal: (type: any, target?: any) => void;
  handleDelete: (id: string) => void;
}) {
  const isOpen = expanded.has(theme.id);
  return (
    <>
      <div className="grid grid-cols-12 py-2 items-center pl-6 bg-gray-50">
        <div className="col-span-4 flex items-center gap-2">
          <button onClick={() => toggleExpand(theme.id)}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
            Theme
          </span>
          <span className="text-sm font-mono">{`T${pillarIndex + 1}.${theme.sort_order}`}</span>
        </div>
        <div className="col-span-6">
          <div className="font-medium">{theme.name}</div>
          <div className="text-xs text-gray-600">{theme.description}</div>
        </div>
        <div className="col-span-1 text-center">{theme.sort_order}</div>
        <div className="col-span-1 text-center">
          {editMode && (
            <>
              <button
                onClick={() => openModal("add-subtheme", theme)}
                className="text-green-600 hover:text-green-800"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => handleDelete(theme.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      {isOpen &&
        theme.subthemes.map((sub: any, sIndex: number) => (
          <RowSubtheme
            key={sub.id}
            sub={sub}
            pillarIndex={pillarIndex}
            themeIndex={theme.sort_order}
            editMode={editMode}
            openModal={openModal}
            handleDelete={handleDeleteSubtheme}
          />
        ))}
    </>
  );
}

function RowSubtheme({
  sub,
  pillarIndex,
  themeIndex,
  editMode,
  openModal,
  handleDelete,
}: {
  sub: any;
  pillarIndex: number;
  themeIndex: number;
  editMode: boolean;
  openModal: (type: any, target?: any) => void;
  handleDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-12 py-2 items-center pl-12">
      <div className="col-span-4 flex items-center gap-2">
        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">
          Subtheme
        </span>
        <span className="text-sm font-mono">{`ST${pillarIndex + 1}.${themeIndex}.${sub.sort_order}`}</span>
      </div>
      <div className="col-span-6">
        <div className="font-medium">{sub.name}</div>
        <div className="text-xs text-gray-600">{sub.description}</div>
      </div>
      <div className="col-span-1 text-center">{sub.sort_order}</div>
      <div className="col-span-1 text-center">
        {editMode && (
          <button
            onClick={() => handleDelete(sub.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
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
