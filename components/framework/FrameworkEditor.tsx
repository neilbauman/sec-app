// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import type { NestedPillar, NestedTheme, Subtheme } from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  Plus,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Badge for type
function TypeBadge({ type }: { type: "pillar" | "theme" | "subtheme" }) {
  const styles: Record<string, string> = {
    pillar: "bg-blue-100 text-blue-800",
    theme: "bg-green-100 text-green-800",
    subtheme: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    pillar: "Pillar",
    theme: "Theme",
    subtheme: "Subtheme",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

// Ref code generator
function generateRefCode(
  type: "pillar" | "theme" | "subtheme",
  indices: number[]
): string {
  if (type === "pillar") return `P${indices[0]}`;
  if (type === "theme") return `T${indices[0]}.${indices[1]}`;
  return `ST${indices[0]}.${indices[1]}.${indices[2]}`;
}

// Action icon (badge-like)
function ActionIcon({
  icon: Icon,
  label,
  onClick,
  color,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  color: "red" | "green";
}) {
  const colors =
    color === "red"
      ? "text-red-600 hover:bg-red-50"
      : "text-green-600 hover:bg-green-50";

  return (
    <div className="relative group inline-flex">
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full p-1.5 transition ${colors}`}
        aria-label={label}
      >
        <Icon className="h-5 w-5" />
      </button>
      <span className="absolute bottom-full mb-1 hidden group-hover:block rounded bg-gray-800 px-2 py-0.5 text-xs text-white whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "pillar" | "theme" | "subtheme";
    parentId?: string;
    count?: number;
  }>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    sort_order: 1,
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    pillars.forEach((p) => {
      all[p.id] = true;
      p.themes.forEach((t) => {
        all[t.id] = true;
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  function resetForm() {
    setFormValues({ name: "", description: "", sort_order: 1 });
  }

  async function handleAdd() {
    if (!formValues.name) return;
    if (openDialog?.type === "pillar") {
      await addPillar(formValues);
    } else if (openDialog?.type === "theme" && openDialog.parentId) {
      await addTheme({ pillar_id: openDialog.parentId, ...formValues });
    } else if (openDialog?.type === "subtheme" && openDialog.parentId) {
      await addSubtheme({ theme_id: openDialog.parentId, ...formValues });
    }
    window.location.reload();
  }

  async function handleDelete(type: "pillar" | "theme" | "subtheme", id: string) {
    if (type === "pillar") await deletePillar(id);
    if (type === "theme") await deleteTheme(id);
    if (type === "subtheme") await deleteSubtheme(id);
    window.location.reload();
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Primary Framework"
        description="Manage pillars, themes, and subthemes."
        breadcrumb={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />

      {/* Controls */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronsDown className="h-4 w-4 mr-1" /> Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronsUp className="h-4 w-4 mr-1" /> Collapse All
          </Button>
          <ActionIcon
            icon={Upload}
            label="Upload CSV"
            color="green"
            onClick={() => alert("CSV upload coming soon")}
          />
          <ActionIcon
            icon={Download}
            label="Download CSV"
            color="green"
            onClick={() => alert("CSV download coming soon")}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={editMode ? "destructive" : "default"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
          {editMode && (
            <Button
              onClick={() => {
                resetForm();
                setOpenDialog({ type: "pillar" });
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Pillar
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow rounded text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 py-2 w-[20%]">Type / Ref Code</th>
            <th className="px-3 py-2 w-[55%]">Name / Description</th>
            <th className="px-3 py-2 w-[10%] text-center">Sort Order</th>
            <th className="px-3 py-2 w-[15%] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((pillar, pIdx) => {
            const pref = generateRefCode("pillar", [
              pillar.sort_order || pIdx + 1,
            ]);
            return (
              <>
                {/* Pillar Row */}
                <tr key={pillar.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleExpand(pillar.id)}>
                        {expanded[pillar.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <TypeBadge type="pillar" />
                      <span className="text-xs text-gray-500">{pref}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-xs text-gray-600">{pillar.description}</div>
                  </td>
                  <td className="px-3 py-2 text-center">{pillar.sort_order}</td>
                  <td className="px-3 py-2 text-right">
                    {editMode && (
                      <div className="flex justify-end gap-2">
                        <ActionIcon
                          icon={Plus}
                          label="Add Theme"
                          color="green"
                          onClick={() => {
                            resetForm();
                            setOpenDialog({
                              type: "theme",
                              parentId: pillar.id,
                              count: pillar.themes.length,
                            });
                          }}
                        />
                        <ActionIcon
                          icon={Trash2}
                          label="Delete Pillar"
                          color="red"
                          onClick={() => handleDelete("pillar", pillar.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>

                {/* Themes */}
                {expanded[pillar.id] &&
                  pillar.themes.map((theme, tIdx) => {
                    const tref = generateRefCode("theme", [
                      pillar.sort_order || pIdx + 1,
                      theme.sort_order || tIdx + 1,
                    ]);
                    return (
                      <>
                        <tr key={theme.id} className="border-t bg-gray-50 hover:bg-gray-100">
                          <td className="px-3 py-2 pl-4 align-top">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleExpand(theme.id)}>
                                {expanded[theme.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <TypeBadge type="theme" />
                              <span className="text-xs text-gray-500">{tref}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 pl-4">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-gray-600">
                              {theme.description}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {theme.sort_order}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {editMode && (
                              <div className="flex justify-end gap-2">
                                <ActionIcon
                                  icon={Plus}
                                  label="Add Subtheme"
                                  color="green"
                                  onClick={() => {
                                    resetForm();
                                    setOpenDialog({
                                      type: "subtheme",
                                      parentId: theme.id,
                                      count: theme.subthemes.length,
                                    });
                                  }}
                                />
                                <ActionIcon
                                  icon={Trash2}
                                  label="Delete Theme"
                                  color="red"
                                  onClick={() => handleDelete("theme", theme.id)}
                                />
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Subthemes */}
                        {expanded[theme.id] &&
                          theme.subthemes.map((s, sIdx) => {
                            const sref = generateRefCode("subtheme", [
                              pillar.sort_order || pIdx + 1,
                              theme.sort_order || tIdx + 1,
                              s.sort_order || sIdx + 1,
                            ]);
                            return (
                              <tr key={s.id} className="border-t hover:bg-gray-50">
                                <td className="px-3 py-2 pl-8 align-top">
                                  <div className="flex items-center gap-2">
                                    <TypeBadge type="subtheme" />
                                    <span className="text-xs text-gray-500">
                                      {sref}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 pl-8">
                                  <div className="font-medium">{s.name}</div>
                                  <div className="text-xs text-gray-600">
                                    {s.description}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {s.sort_order}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {editMode && (
                                    <div className="flex justify-end gap-2">
                                      <ActionIcon
                                        icon={Trash2}
                                        label="Delete Subtheme"
                                        color="red"
                                        onClick={() =>
                                          handleDelete("subtheme", s.id)
                                        }
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </>
                    );
                  })}
              </>
            );
          })}
        </tbody>
      </table>

      {/* Add Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add{" "}
              {openDialog?.type === "pillar"
                ? "Pillar"
                : openDialog?.type === "theme"
                ? "Theme"
                : "Subtheme"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Sort order"
              value={formValues.sort_order}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  sort_order: parseInt(e.target.value, 10),
                })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
