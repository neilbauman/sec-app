"use client";

import { useEffect, useState } from "react";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronRight,
  Upload,
  Download,
  Edit,
  Plus,
  Trash,
  X,
} from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

type ModalType =
  | null
  | "add-pillar"
  | "add-theme"
  | "add-subtheme"
  | "edit-pillar"
  | "edit-theme"
  | "edit-subtheme";

type DeleteTarget = {
  type: "pillar" | "theme" | "subtheme";
  name: string;
  childrenCount?: number;
};

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalTarget, setModalTarget] = useState<any>(null);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFramework();
        setPillars(data ?? []);
      } catch (err: any) {
        console.error("Framework load error:", err);
        setError(err.message || "Failed to load framework data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortByOrder = (arr: any[] = []) =>
    [...arr].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Expand/Collapse controls
  const expandAll = () => {
    const ids = new Set<string>();
    pillars.forEach((p: any) => {
      ids.add(`pillar-${p.id}`);
      p.themes?.forEach((t: any) => ids.add(`theme-${t.id}`));
    });
    setExpanded(ids);
  };
  const collapseAll = () => setExpanded(new Set());
  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  // Modal handlers
  const openModal = (type: ModalType, target: any = null) => {
    setModalType(type);
    setModalTarget(target);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalTarget(null);
  };

  // Delete handlers
  const confirmDelete = (target: DeleteTarget) => {
    setDeleteTarget(target);
    setDeleteOpen(true);
  };
  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const handleDelete = () => {
    // TODO: wire to Supabase
    console.log("Deleting", deleteTarget);
    cancelDelete();
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

      <div className="bg-white shadow rounded-lg p-6">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Collapse All
            </button>
            {editMode && (
              <button
                onClick={() => openModal("add-pillar")}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 rounded"
              >
                + Add Pillar
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 rounded"
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Upload className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm border-collapse table-fixed">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="w-[5%]"></th>
                <th className="w-[20%] py-2 pr-4">Type / Ref Code</th>
                <th className="w-[55%] py-2 pr-4">Name / Description</th>
                <th className="w-[10%] py-2 pr-4 text-center">Sort Order</th>
                <th className="w-[10%] py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortByOrder(pillars).map((pillar: any, pIndex: number) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  index={pillar.sort_order ?? pIndex + 1}
                  expanded={expanded}
                  toggle={toggle}
                  sortByOrder={sortByOrder}
                  editMode={editMode}
                  openModal={openModal}
                  confirmDelete={confirmDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {modalType?.replace("-", " ")}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: wire to Supabase (insert/update)
                closeModal();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={modalTarget?.name || ""}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  defaultValue={modalTarget?.description || ""}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  defaultValue={modalTarget?.sort_order || ""}
                  className="w-24 border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete this{" "}
              <strong>{deleteTarget.type}</strong>:{" "}
              <em>{deleteTarget.name}</em>?
            </p>
            {deleteTarget.childrenCount && deleteTarget.childrenCount > 0 && (
              <p className="mb-4 text-sm text-red-500">
                Warning: This {deleteTarget.type} has {deleteTarget.childrenCount}{" "}
                child item(s). Deleting it will also delete all of them.
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PillarRow({
  pillar,
  index,
  expanded,
  toggle,
  sortByOrder,
  editMode,
  openModal,
  confirmDelete,
}: {
  pillar: any;
  index: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
  editMode: boolean;
  openModal: (type: ModalType, target?: any) => void;
  confirmDelete: (target: DeleteTarget) => void;
}) {
  const id = `pillar-${pillar.id}`;
  const refCode = `P${index}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2">
          {pillar.themes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            Pillar
          </span>
          <span className="ml-2 text-gray-500 text-xs">{refCode}</span>
        </td>
        <td className="py-2 pr-4">
          <div className="font-semibold">{pillar.name}</div>
          {pillar.description && (
            <div className="text-gray-500 text-xs mt-0.5">{pillar.description}</div>
          )}
        </td>
        <td className="py-2 pr-4 text-center">
          {editMode ? (
            <input
              type="number"
              defaultValue={pillar.sort_order}
              className="w-12 border rounded text-center text-sm"
            />
          ) : (
            pillar.sort_order
          )}
        </td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openModal("edit-pillar", pillar)}
              >
                <Edit className="h-4 w-4 inline" />
              </button>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => openModal("add-theme", pillar)}
              >
                <Plus className="h-4 w-4 inline" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() =>
                  confirmDelete({
                    type: "pillar",
                    name: pillar.name,
                    childrenCount: pillar.themes?.length || 0,
                  })
                }
              >
                <Trash className="h-4 w-4 inline" />
              </button>
            </>
          )}
        </td>
      </tr>

      {isOpen &&
        sortByOrder(pillar.themes).map((theme: any) => (
          <ThemeRow
            key={theme.id}
            theme={theme}
            pillarIndex={index}
            expanded={expanded}
            toggle={toggle}
            sortByOrder={sortByOrder}
            editMode={editMode}
            openModal={openModal}
            confirmDelete={confirmDelete}
          />
        ))}
    </>
  );
}

function ThemeRow({
  theme,
  pillarIndex,
  expanded,
  toggle,
  sortByOrder,
  editMode,
  openModal,
  confirmDelete,
}: {
  theme: any;
  pillarIndex: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
  editMode: boolean;
  openModal: (type: ModalType, target?: any) => void;
  confirmDelete: (target: DeleteTarget) => void;
}) {
  const id = `theme-${theme.id}`;
  const refCode = `T${pillarIndex}.${theme.sort_order}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pr-2 pl-4">
          {theme.subthemes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1">
              <ChevronRight
                className={`h-3 w-3 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap pl-4">
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            Theme
          </span>
          <span className="ml-2 text-gray-500 text-xs">{refCode}</span>
        </td>
        <td className="py-2 pr-4 pl-4">
          <div className="font-medium">{theme.name}</div>
          {theme.description && (
            <div className="text-gray-500 text-xs mt-0.5">{theme.description}</div>
          )}
        </td>
        <td className="py-2 pr-4 text-center">
          {editMode ? (
            <input
              type="number"
              defaultValue={theme.sort_order}
              className="w-12 border rounded text-center text-sm"
            />
          ) : (
            theme.sort_order
          )}
        </td>
        <td className="py-2 text-right space-x-2">
          {editMode && (
            <>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openModal("edit-theme", theme)}
              >
                <Edit className="h-4 w-4 inline" />
              </button>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => openModal("add-subtheme", theme)}
              >
                <Plus className="h-4 w-4 inline" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() =>
                  confirmDelete({
                    type: "theme",
                    name: theme
