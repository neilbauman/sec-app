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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { Plus, Trash2 } from "lucide-react";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);

  // State for dialogs
  const [openDialog, setOpenDialog] = useState<null | {
    type: "pillar" | "theme" | "subtheme";
    parentId?: string;
  }>(null);

  const [formValues, setFormValues] = useState({ name: "", description: "", sort_order: 1 });

  function resetForm() {
    setFormValues({ name: "", description: "", sort_order: 1 });
  }

  async function handleAdd() {
    if (!formValues.name) return;

    if (openDialog?.type === "pillar") {
      const newPillar = {
        name: formValues.name,
        description: formValues.description,
        sort_order: formValues.sort_order,
      };
      await addPillar(newPillar);
    } else if (openDialog?.type === "theme" && openDialog.parentId) {
      const newTheme = {
        pillar_id: openDialog.parentId,
        name: formValues.name,
        description: formValues.description,
        sort_order: formValues.sort_order,
      };
      await addTheme(newTheme);
    } else if (openDialog?.type === "subtheme" && openDialog.parentId) {
      const newSubtheme = {
        theme_id: openDialog.parentId,
        name: formValues.name,
        description: formValues.description,
        sort_order: formValues.sort_order,
      };
      await addSubtheme(newSubtheme);
    }

    // Refresh page state (TODO: replace with real re-fetch later)
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

      {/* Add Pillar button */}
      <div className="mb-4">
        <Button onClick={() => { resetForm(); setOpenDialog({ type: "pillar" }); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Pillar
        </Button>
      </div>

      {/* Pillar list */}
      <div className="space-y-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{pillar.name}</div>
                <div className="text-sm text-gray-600">{pillar.description}</div>
                <div className="text-xs text-gray-400">Sort: {pillar.sort_order}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { resetForm(); setOpenDialog({ type: "theme", parentId: pillar.id }); }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Theme
                </Button>
                <AlertDialog
                  open={false}
                  onOpenChange={() => handleDelete("pillar", pillar.id)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete pillar "{pillar.name}"?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            {/* Themes */}
            <CardContent>
              {pillar.themes.map((theme) => (
                <Card key={theme.id} className="ml-4 my-2">
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <div>{theme.name}</div>
                      <div className="text-sm text-gray-600">{theme.description}</div>
                      <div className="text-xs text-gray-400">Sort: {theme.sort_order}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { resetForm(); setOpenDialog({ type: "subtheme", parentId: theme.id }); }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Subtheme
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete("theme", theme.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Subthemes */}
                  <CardContent>
                    {theme.subthemes.map((s) => (
                      <Card key={s.id} className="ml-4 my-1">
                        <CardHeader className="flex items-center justify-between">
                          <div>
                            <div>{s.name}</div>
                            <div className="text-sm text-gray-600">{s.description}</div>
                            <div className="text-xs text-gray-400">Sort: {s.sort_order}</div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete("subtheme", s.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </CardHeader>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {openDialog?.type === "pillar"
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
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Sort order"
              value={formValues.sort_order}
              onChange={(e) =>
                setFormValues({ ...formValues, sort_order: parseInt(e.target.value, 10) })
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
