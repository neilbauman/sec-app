// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

type OpenDialog =
  | { type: "pillar" }
  | { type: "theme"; pillarId: string }
  | { type: "subtheme"; themeId: string }
  | null;

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const allIds: Record<string, boolean> = {};
    pillars.forEach((p) => {
      allIds[p.id] = true;
      p.themes.forEach((t) => {
        allIds[t.id] = true;
        t.subthemes.forEach((s) => (allIds[s.id] = true));
      });
    });
    setExpanded(allIds);
  }

  function collapseAll() {
    setExpanded({});
  }

  function resetForm() {
    setForm({ name: "", description: "" });
  }

  async function handleSave() {
    if (!openDialog) return;
    if (!form.name.trim()) return;

    if (openDialog.type === "pillar") {
      await addPillar({
        name: form.name,
        description: form.description,
        sort_order: pillars.length + 1,
      });
    } else if (openDialog.type === "theme") {
      const pillar = pillars.find((p) => p.id === openDialog.pillarId);
      const count = pillar?.themes.length ?? 0;
      await addTheme({
        pillar_id: openDialog.pillarId,
        name: form.name,
        description: form.description,
        sort_order: count + 1,
      });
    } else if (openDialog.type === "subtheme") {
      let count = 0;
      pillars.forEach((p) =>
        p.themes.forEach((t) => {
          if (t.id === openDialog.themeId) count = t.subthemes.length;
        })
      );
      await addSubtheme({
        theme_id: openDialog.themeId,
        name: form.name,
        description: form.description,
        sort_order: count + 1,
      });
    }

    setOpenDialog(null);
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
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="h-7 px-2 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={expandAll}
          >
            <ChevronsDown className="h-3.5 w-3.5 mr-1" /> Expand All
          </Button>
          <Button
            variant="outline"
            className="h-7 px-2 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={collapseAll}
          >
            <ChevronsUp className="h-3.5 w-3.5 mr-1" /> Collapse All
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="h-7 px-2 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </Button>
          {editMode && (
            <>
              <Button
                variant="outline"
                className="h-7 px-2 text-xs text-gray-600 border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  resetForm();
                  setOpenDialog({ type: "pillar" });
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Pillar
              </Button>
              <button
                onClick={() => alert("CSV upload coming soon")}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Upload CSV"
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                onClick={() => alert("CSV download coming soon")}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Download CSV"
              >
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="w-[25%] px-3 py-2">Type / Ref Code</th>
              <th className="w-[55%] px-3 py-2">Name / Description</th>
              <th className="w-[10%] px-3 py-2 text-center">Sort Order</th>
              <th className="w-[10%] px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar, pi) => {
              const ref = `P${pillar.sort_order ?? pi + 1}`;
              const isExpanded = expanded[pillar.id];
              return (
                <>
                  <tr key={pillar.id} className="border-t">
                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleExpand(pillar.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <Badge className="bg-blue-100 text-blue-700">
                          Pillar
                        </Badge>
                        <span className="text-xs text-gray-400">{ref}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-gray-500">
                        {pillar.description}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {pillar.sort_order}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {editMode && (
                        <>
                          <button
                            onClick={() => {
                              resetForm();
                              setOpenDialog({
                                type: "theme",
                                pillarId: pillar.id,
                              });
                            }}
                            className="text-gray-500 hover:text-gray-700 mr-2"
                            title="Add Theme"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete("pillar", pillar.id)
                            }
                            className="text-red-500 hover:text-red-700"
                            title="Delete Pillar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {isExpanded &&
                    pillar.themes.map((theme, ti) => {
                      const tref = `${ref}.${theme.sort_order ?? ti + 1}`;
                      const tExpanded = expanded[theme.id];
                      return (
                        <>
                          <tr key={theme.id} className="border-t">
                            <td className="px-3 py-2 pl-8 align-top">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleExpand(theme.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {tExpanded ? (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <Badge className="bg-green-100 text-green-700">
                                  Theme
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {tref}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium">{theme.name}</div>
                              <div className="text-xs text-gray-500">
                                {theme.description}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {theme.sort_order}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {editMode && (
                                <>
                                  <button
                                    onClick={() => {
                                      resetForm();
                                      setOpenDialog({
                                        type: "subtheme",
                                        themeId: theme.id,
                                      });
                                    }}
                                    className="text-gray-500 hover:text-gray-700 mr-2"
                                    title="Add Subtheme"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete("theme", theme.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete Theme"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                          {tExpanded &&
                            theme.subthemes.map((s, si) => {
                              const sref = `${tref}.${s.sort_order ?? si + 1}`;
                              return (
                                <tr key={s.id} className="border-t">
                                  <td className="px-3 py-2 pl-12 align-top">
                                    <div className="flex items-center gap-1">
                                      <Badge className="bg-red-100 text-red-700">
                                        Subtheme
                                      </Badge>
                                      <span className="text-xs text-gray-400">
                                        {sref}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="font-medium">{s.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {s.description}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {s.sort_order}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {editMode && (
                                      <button
                                        onClick={() =>
                                          handleDelete("subtheme", s.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete Subtheme"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
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
      </div>

      {/* Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {openDialog?.type === "pillar"
                ? "Add Pillar"
                : openDialog?.type === "theme"
                ? "Add Theme"
                : "Add Subtheme"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              className="h-7 px-2 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-7 px-3 text-xs bg-[#b7410e] text-white hover:bg-[#a63a0c]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
