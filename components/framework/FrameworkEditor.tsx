"use client";

import { useEffect, useState } from "react";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
} from "@/lib/framework-actions";
import { fetchFramework, Pillar } from "@/lib/framework-client";
import PageHeader from "@/components/ui/PageHeader";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
} from "lucide-react";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    type: "add-pillar" | "add-theme" | null;
    parentId?: string;
  }>({ type: null });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  function toggleExpand(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
  }

  async function handleSave() {
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
          pillar_id: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      }

      setModal({ type: null });
      setName("");
      setDesc("");

      // Refresh
      const data = await fetchFramework();
      setPillars(data);
    } catch (err: any) {
      alert(err.message || "Error saving");
    }
  }

  async function handleDeletePillar(id: string) {
    if (!confirm("Delete this pillar?")) return;
    try {
      await deletePillar(id);
      setPillars(pillars.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting");
    }
  }

  async function handleDeleteTheme(id: string) {
    if (!confirm("Delete this theme?")) return;
    try {
      await deleteTheme(id);
      const data = await fetchFramework();
      setPillars(data);
    } catch (err: any) {
      alert(err.message || "Error deleting");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => {
              const all = new Set<string>();
              pillars.forEach((p) => {
                all.add(p.id);
                p.themes.forEach((t) => all.add(t.id));
              });
              setExpanded(all);
            }}
            className="text-sm text-gray-600 border rounded px-2 py-1"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpanded(new Set())}
            className="text-sm text-gray-600 border rounded px-2 py-1"
          >
            Collapse All
          </button>
          {editMode && (
            <button
              onClick={() => setModal({ type: "add-pillar" })}
              className="text-sm text-white bg-blue-600 rounded px-2 py-1"
            >
              + Add Pillar
            </button>
          )}
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm text-white bg-orange-400 rounded px-2 py-1"
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left py-2 px-4 w-1/6">Type</th>
              <th className="text-left py-2 px-4 w-3/6">Name / Description</th>
              <th className="text-center py-2 px-4 w-1/6">Sort Order</th>
              <th className="text-right py-2 px-4 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <>
                <tr key={pillar.id} className="border-b">
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleExpand(pillar.id)}
                      className="mr-1"
                    >
                      {expanded.has(pillar.id) ? (
                        <ChevronDown className="inline h-4 w-4" />
                      ) : (
                        <ChevronRight className="inline h-4 w-4" />
                      )}
                    </button>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      Pillar
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-gray-500 text-xs">{pillar.description}</div>
                  </td>
                  <td className="py-2 px-4 text-center">{pillar.sort_order}</td>
                  <td className="py-2 px-4 text-right space-x-2">
                    {editMode && (
                      <>
                        <button
                          onClick={() =>
                            setModal({ type: "add-theme", parentId: pillar.id })
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          <Plus className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeletePillar(pillar.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {expanded.has(pillar.id) &&
                  pillar.themes.map((theme) => (
                    <tr key={theme.id} className="border-b bg-gray-50">
                      <td className="py-2 px-8">
                        <button
                          onClick={() => toggleExpand(theme.id)}
                          className="mr-1"
                        >
                          {expanded.has(theme.id) ? (
                            <ChevronDown className="inline h-4 w-4" />
                          ) : (
                            <ChevronRight className="inline h-4 w-4" />
                          )}
                        </button>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                          Theme
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-gray-500 text-xs">
                          {theme.description}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {theme.sort_order}
                      </td>
                      <td className="py-2 px-4 text-right space-x-2">
                        {editMode && (
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {modal.type === "add-pillar" ? "Add Pillar" : "Add Theme"}
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="w-full border px-2 py-1 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModal({ type: null })}
                className="px-3 py-1 border rounded"
              >
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
