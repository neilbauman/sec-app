// components/framework/FrameworkEditor.tsx
"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import type {
  NestedPillar,
  NestedTheme,
  Subtheme,
} from "@/lib/framework-client";
import {
  addPillar,
  addTheme,
  addSubtheme,
  deletePillar,
  deleteTheme,
  deleteSubtheme,
} from "@/lib/framework-actions";
import { Plus, Trash } from "lucide-react";
import {
  Button,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);

  // --- Dialog State ---
  const [openAdd, setOpenAdd] = useState<{
    type: "pillar" | "theme" | "subtheme" | null;
    parentId?: string;
  }>({ type: null });

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "pillar" | "theme" | "subtheme";
    id: string;
    name: string;
  } | null>(null);

  const [newName, setNewName] = useState("");

  // --- Handlers ---
  async function handleAdd() {
    if (!newName.trim() || !openAdd.type) return;
    if (openAdd.type === "pillar") {
      await addPillar({
        name: newName,
        description: "",
        sort_order: pillars.length + 1,
      });
    }
    if (openAdd.type === "theme" && openAdd.parentId) {
      const pillar = pillars.find((p) => p.id === openAdd.parentId);
      const count = pillar?.themes?.length ?? 0;
      await addTheme({
        pillar_id: openAdd.parentId,
        name: newName,
        description: "",
        sort_order: count + 1,
      });
    }
    if (openAdd.type === "subtheme" && openAdd.parentId) {
      let count = 0;
      pillars.forEach((p) =>
        p.themes.forEach((t) => {
          if (t.id === openAdd.parentId) count = t.subthemes.length;
        })
      );
      await addSubtheme({
        theme_id: openAdd.parentId,
        name: newName,
        description: "",
        sort_order: count + 1,
      });
    }
    window.location.reload(); // TODO: later: update local state instead of reload
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "pillar") {
      await deletePillar(deleteTarget.id);
    }
    if (deleteTarget.type === "theme") {
      await deleteTheme(deleteTarget.id);
    }
    if (deleteTarget.type === "subtheme") {
      await deleteSubtheme(deleteTarget.id);
    }
    window.location.reload();
  }

  // --- UI ---
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

      <div className="mb-4">
        <Button onClick={() => setOpenAdd({ type: "pillar" })}>
          <Plus className="mr-2 h-4 w-4" /> Add Pillar
        </Button>
      </div>

      <div className="space-y-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id} className="p-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{pillar.name}</h2>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpenAdd({ type: "theme", parentId: pillar.id })}
                >
                  <Plus className="mr-1 h-3 w-3" /> Theme
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setDeleteTarget({
                      type: "pillar",
                      id: pillar.id,
                      name: pillar.name,
                    })
                  }
                >
                  <Trash className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </div>

            {/* Themes */}
            <div className="mt-2 space-y-2 pl-4">
              {pillar.themes.map((theme: NestedTheme) => (
                <Card key={theme.id} className="p-2">
                  <div className="flex items-center justify-between">
                    <span>{theme.name}</span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setOpenAdd({ type: "subtheme", parentId: theme.id })
                        }
                      >
                        <Plus className="mr-1 h-3 w-3" /> Subtheme
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setDeleteTarget({
                            type: "theme",
                            id: theme.id,
                            name: theme.name,
                          })
                        }
                      >
                        <Trash className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>

                  {/* Subthemes */}
                  <div className="mt-2 space-y-1 pl-4">
                    {theme.subthemes.map((s: Subtheme) => (
                      <Card
                        key={s.id}
                        className="flex items-center justify-between p-2"
                      >
                        <span>{s.name}</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setDeleteTarget({
                              type: "subtheme",
                              id: s.id,
                              name: s.name,
                            })
                          }
                        >
                          <Trash className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* --- Add Dialog --- */}
      <Dialog
        open={!!openAdd.type}
        onOpenChange={() => {
          setOpenAdd({ type: null });
          setNewName("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {openAdd.type ? openAdd.type.charAt(0).toUpperCase() + openAdd.type.slice(1) : ""}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder={`Enter ${openAdd.type} name`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd({ type: null })}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirm --- */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.type}: {deleteTarget?.name}?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
