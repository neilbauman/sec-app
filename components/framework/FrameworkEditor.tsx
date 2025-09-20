"use client";

import { useEffect, useState } from "react";
import { Pillar, fetchFramework } from "@/lib/framework-client";
import {
  addPillar,
  deletePillar,
  addTheme,
  deleteTheme,
  addSubtheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

type ModalType = "add-pillar" | "add-theme" | "add-subtheme";

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState<{ type: ModalType; parentId?: string } | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await fetchFramework();
    setPillars(data);
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openModal = (type: ModalType, parentId?: string) => {
    setModal({ type, parentId });
    setName("");
    setDesc("");
  };

  const handleSave = async () => {
    if (!modal) return;
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
        const theme = pillars.flatMap((p) => p.themes ?? []).find((t) => t.id === modal.parentId);
        const count = theme?.subthemes?.length ?? 0;
        await addSubtheme({
          themeId: modal.parentId,
          name,
          description: desc,
          sort_order: count + 1,
        });
      }
      await loadData();
      setModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary" },
        ]}
      />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Primary Framework Editor</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      <div className="space-y-2">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border rounded p-2 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button onClick={() => toggleExpand(pillar.id)}>
                  {expanded.has(pillar.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <span className="font-semibold">{pillar.name}</span>
              </div>
              {editMode && (
                <div className="space-x-2">
                  <Button size="sm" onClick={() => openModal("add-theme", pillar.id)}>
                    <Plus size={14} className="mr-1" /> Theme
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await deletePillar(pillar.id);
                      await loadData();
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </div>

            {expanded.has(pillar.id) && (
              <div className="ml-6 mt-2 space-y-1">
                {pillar.themes?.map((theme) => (
                  <div key={theme.id} className="border rounded p-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => toggleExpand(theme.id)}>
                          {expanded.has(theme.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <span>{theme.name}</span>
                      </div>
                      {editMode && (
                        <div className="space-x-2">
                          <Button size="sm" onClick={() => openModal("add-subtheme", theme.id)}>
                            <Plus size={14} className="mr-1" /> Subtheme
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              await deleteTheme(theme.id);
                              await loadData();
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>

                    {expanded.has(theme.id) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {theme.subthemes?.map((sub) => (
                          <div
                            key={sub.id}
                            className="border rounded p-2 bg-gray-100 flex justify-between items-center"
                          >
                            <span>{sub.name}</span>
                            {editMode && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={async () => {
                                  await deleteSubtheme(sub.id);
                                  await loadData();
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

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
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full border rounded p-2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
