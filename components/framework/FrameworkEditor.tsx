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
  X, // close icon for modal
} from "lucide-react";

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

// Delete modal target typing
type DeleteTarget = {
  type: "pillar" | "theme" | "subtheme";
  name: string;
  id: string;
  childrenCount?: number;
};

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // NEW: delete confirmation modal state (safe – no DB yet)
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

  // Delete modal handlers (safe – just logs right now)
  function openDelete(target: DeleteTarget) {
    setDeleteTarget(target);
    setDeleteOpen(true);
  }
  function closeDelete() {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }
  function confirmDelete() {
    if (!deleteTarget) return;
    // 🚧 placeholder – no DB calls yet
    console.log("CONFIRM DELETE:", deleteTarget);
    closeDelete();
  }

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
        {/* Controls */}
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
                onClick={() => console.log("Add Pillar clicked")}
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
                  onDelete={openDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL (safe stub) */}
      {deleteOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={closeDelete}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-3 text-lg font-semibold text-red-600">
              Confirm Delete
            </h2>

            <p className="text-sm text-gray-700">
              Are you sure you want to delete this{" "}
              <strong className="capitalize">{deleteTarget.type}</strong>:{" "}
              <em>{deleteTarget.name}</em>?
            </p>

            {!!deleteTarget.childrenCount && deleteTarget.childrenCount > 0 && (
              <p className="mt-3 text-sm text-red-500">
                This {deleteTarget.type} has {deleteTarget.childrenCount} child
                item(s). Deleting it will also delete them.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDelete}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
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
  onDelete,
}: {
  pillar: any;
  index: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
  editMode: boolean;
  onDelete: (target: {
    type: "pillar" | "theme" | "subtheme";
    name: string;
    id: string;
    childrenCount?: number;
  }) => void;
}) {
  const id = `pillar-${pillar.id}`;
  const refCode = `P${index}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2">
          {pillar.themes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1" aria-label="Toggle pillar">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap">
          <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
            Pillar
          </span>
          <span className="ml-2 text-xs text-gray-500">{refCode}</span>
        </td>
        <td className="py-2 pr-4">
          <div className="font-semibold">{pillar.name}</div>
          {pillar.description && (
            <div className="mt-0.5 text-xs text-gray-500">
              {pillar.description}
            </div>
          )}
        </td>
        <td className="py-2 pr-4 text-center">
          {editMode ? (
            <input
              type="number"
              defaultValue={pillar.sort_order}
              className="w-12 rounded border text-center text-sm"
            />
          ) : (
            pillar.sort_order
          )}
        </td>
        <td className="py-2 text-right">
          {editMode && (
            <div className="space-x-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => console.log("Edit pillar", pillar.id)}
                aria-label="Edit pillar"
              >
                <Edit className="inline h-4 w-4" />
              </button>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => console.log("Add theme under pillar", pillar.id)}
                aria-label="Add theme"
              >
                <Plus className="inline h-4 w-4" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() =>
                  onDelete({
                    type: "pillar",
                    name: pillar.name,
                    id: pillar.id,
                    childrenCount: pillar.themes?.length || 0,
                  })
                }
                aria-label="Delete pillar"
              >
                <Trash className="inline h-4 w-4" />
              </button>
            </div>
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
            onDelete={onDelete}
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
  onDelete,
}: {
  theme: any;
  pillarIndex: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  sortByOrder: (arr: any[]) => any[];
  editMode: boolean;
  onDelete: (target: {
    type: "pillar" | "theme" | "subtheme";
    name: string;
    id: string;
    childrenCount?: number;
  }) => void;
}) {
  const id = `theme-${theme.id}`;
  const refCode = `T${pillarIndex}.${theme.sort_order}`;
  const isOpen = expanded.has(id);

  return (
    <>
      <tr className="border-b bg-gray-50">
        <td className="py-2 pr-2 pl-4">
          {theme.subthemes?.length > 0 && (
            <button onClick={() => toggle(id)} className="p-1" aria-label="Toggle theme">
              <ChevronRight
                className={`h-3 w-3 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </td>
        <td className="py-2 pr-4 whitespace-nowrap pl-4">
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
            Theme
          </span>
          <span className="ml-2 text-xs text-gray-500">{refCode}</span>
        </td>
        <td className="py-2 pr-4 pl-4">
          <div className="font-medium">{theme.name}</div>
          {theme.description && (
            <div className="mt-0.5 text-xs text-gray-500">
              {theme.description}
            </div>
          )}
        </td>
        <td className="py-2 pr-4 text-center">
          {editMode ? (
            <input
              type="number"
              defaultValue={theme.sort_order}
              className="w-12 rounded border text-center text-sm"
            />
          ) : (
            theme.sort_order
          )}
        </td>
        <td className="py-2 text-right">
          {editMode && (
            <div className="space-x-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => console.log("Edit theme", theme.id)}
                aria-label="Edit theme"
              >
                <Edit className="inline h-4 w-4" />
              </button>
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => console.log("Add subtheme under theme", theme.id)}
                aria-label="Add subtheme"
              >
                <Plus className="inline h-4 w-4" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() =>
                  onDelete({
                    type: "theme",
                    name: theme.name,
                    id: theme.id,
                    childrenCount: theme.subthemes?.length || 0,
                  })
                }
                aria-label="Delete theme"
              >
                <Trash className="inline h-4 w-4" />
              </button>
            </div>
          )}
        </td>
      </tr>

      {isOpen &&
        sortByOrder(theme.subthemes).map((sub: any) => (
          <SubthemeRow
            key={sub.id}
            sub={sub}
            pillarIndex={pillarIndex}
            themeIndex={theme.sort_order}
            editMode={editMode}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}

function SubthemeRow({
  sub,
  pillarIndex,
  themeIndex,
  editMode,
  onDelete,
}: {
  sub: any;
  pillarIndex: number;
  themeIndex: number;
  editMode: boolean;
  onDelete: (target: {
    type: "pillar" | "theme" | "subtheme";
    name: string;
    id: string;
    childrenCount?: number;
  }) => void;
}) {
  const refCode = `ST${pillarIndex}.${themeIndex}.${sub.sort_order}`;

  return (
    <tr className="border-b bg-gray-100">
      <td className="py-2 pr-2 pl-8"></td>
      <td className="py-2 pr-4 whitespace-nowrap pl-8">
        <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
          Subtheme
        </span>
        <span className="ml-2 text-xs text-gray-500">{refCode}</span>
      </td>
      <td className="py-2 pr-4 pl-8">
        <div>{sub.name}</div>
        {sub.description && (
          <div className="mt-0.5 text-xs text-gray-500">{sub.description}</div>
        )}
      </td>
      <td className="py-2 pr-4 text-center">
        {editMode ? (
          <input
            type="number"
            defaultValue={sub.sort_order}
            className="w-12 rounded border text-center text-sm"
          />
        ) : (
          sub.sort_order
        )}
      </td>
      <td className="py-2 text-right">
        {editMode && (
          <div className="space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => console.log("Edit subtheme", sub.id)}
              aria-label="Edit subtheme"
            >
              <Edit className="inline h-4 w-4" />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() =>
                onDelete({
                  type: "subtheme",
                  name: sub.name,
                  id: sub.id,
                })
              }
              aria-label="Delete subtheme"
            >
              <Trash className="inline h-4 w-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
