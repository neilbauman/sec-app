"use client";

import { useEffect, useState } from "react";
import {
  addPillar,
  editPillar,
  deletePillar,
  addTheme,
  editTheme,
  deleteTheme,
  addSubtheme,
  editSubtheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { fetchFramework } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

//
// Inline types
//
interface Subtheme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

interface FrameworkEditorProps {
  group: "configuration";
  page: "primary";
}

type ModalType =
  | "add-pillar"
  | "edit-pillar"
  | "delete-pillar"
  | "add-theme"
  | "edit-theme"
  | "delete-theme"
  | "add-subtheme"
  | "edit-subtheme"
  | "delete-subtheme"
  | null;

export default function FrameworkEditor({ group, page }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<ModalType>(null);

  async function loadFramework() {
    try {
      setLoading(true);
      const data = await fetchFramework();
      setPillars(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load framework data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFramework();
  }, []);

  function openModal(type: ModalType) {
    setModalType(type);
  }
  function closeModal() {
    setModalType(null);
  }

  async function handleSavePillar(values: {
    name: string;
    description: string;
    sort_order: number;
  }) {
    try {
      await addPillar(values);
      await loadFramework();
      closeModal();
    } catch (err) {
      console.error("Error saving pillar:", err);
    }
  }

  function toggleExpand(id: string) {
    const newSet = new Set(expanded);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpanded(newSet);
  }

  function expandAll() {
    const all = new Set<string>();
    pillars.forEach((p) => {
      all.add(p.id);
      p.themes.forEach((t) => {
        all.add(t.id);
        t.subthemes.forEach((s) => all.add(s.id));
      });
    });
    setExpanded(all);
  }

  function collapseAll() {
    setExpanded(new Set());
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

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2 flex items-center">
            <button
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
              onClick={expandAll}
            >
              Expand All
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
              onClick={collapseAll}
            >
              Collapse All
            </button>
            {editMode && (
              <button
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => openModal("add-pillar")}
              >
                + Add Pillar
              </button>
            )}
          </div>
          <div className="space-x-2 flex items-center">
            <button className="p-2 rounded hover:bg-gray-100">
              <Upload className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-gray-100">
              <Download className="h-4 w-4" />
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-orange-200 text-orange-800 hover:bg-orange-300"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading framework…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-700">
                <th className="w-1/5 py-2">Type / Ref Code</th>
                <th className="w-3/5 py-2">Name / Description</th>
                <th className="w-1/10 py-2 text-center">Sort Order</th>
                <th className="w-1/10 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((pillar, pIndex) => (
                <PillarRow
                  key={pillar.id}
                  pillar={pillar}
                  index={pIndex}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  editMode={editMode}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Pillar Modal */}
      {modalType === "add-pillar" && (
        <Modal
          title="Add Pillar"
          onClose={closeModal}
          onSave={handleSavePillar}
          initialValues={{ name: "", description: "", sort_order: 1 }}
        />
      )}
    </div>
  );
}

//
// Pillar Row
//
function PillarRow({
  pillar,
  index,
  expanded,
  toggleExpand,
  editMode,
}: {
  pillar: Pillar;
  index: number;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  editMode: boolean;
}) {
  const isOpen = expanded.has(pillar.id);
  return (
    <>
      <tr className="border-b">
        <td className="py-2 pr-2 pl-4">
          <button onClick={() => toggleExpand(pillar.id)}>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 inline" />
            ) : (
              <ChevronRight className="h-4 w-4 inline" />
            )}
          </button>
          <span className="ml-2 rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">
            Pillar
          </span>
          <span className="ml-2 text-sm text-gray-600">P{index + 1}</span>
        </td>
        <td className="py-2">
          <div className="font-medium">{pillar.name}</div>
          <div className="text-sm text-gray-500">{pillar.description}</div>
        </td>
        <td className="py-2 text-center">{pillar.sort_order}</td>
        <td className="py-2 text-right">
          {editMode && (
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="h-4 w-4 inline" />
            </button>
          )}
        </td>
      </tr>
      {isOpen &&
        pillar.themes.map((theme, tIndex) => (
          <ThemeRow key={theme.id} theme={theme} tIndex={tIndex} pIndex={index} />
        ))}
    </>
  );
}

//
// Theme Row
//
function ThemeRow({
  theme,
  tIndex,
  pIndex,
}: {
  theme: Theme;
  tIndex: number;
  pIndex: number;
}) {
  return (
    <tr className="border-b bg-gray-50">
      <td className="py-2 pr-2 pl-8">
        <span className="rounded bg-green-100 text-green-800 px-2 py-0.5 text-xs">
          Theme
        </span>
        <span className="ml-2 text-sm text-gray-600">
          T{pIndex + 1}.{tIndex + 1}
        </span>
      </td>
      <td className="py-2">
        <div className="font-medium">{theme.name}</div>
        <div className="text-sm text-gray-500">{theme.description}</div>
      </td>
      <td className="py-2 text-center">{theme.sort_order}</td>
      <td />
    </tr>
  );
}

//
// Modal
//
function Modal({
  title,
  onClose,
  onSave,
  initialValues,
}: {
  title: string;
  onClose: () => void;
  onSave: (values: {
    name: string;
    description: string;
    sort_order: number;
  }) => void;
  initialValues: { name: string; description: string; sort_order: number };
}) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [sortOrder, setSortOrder] = useState(initialValues.sort_order);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() =>
              onSave({ name, description, sort_order: sortOrder })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
