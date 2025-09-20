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

export default function FrameworkEditor() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [modal, setModal] = useState<{
    type: "add-pillar" | "add-theme" | "add-subtheme" | null;
    parentId?: string;
  }>({ type: null });

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // load data from DB
  const loadData = async () => {
    setLoading(true);
    const data = await fetchFramework();
    setPillars(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (
    type: "add-pillar" | "add-theme" | "add-subtheme",
    parentId?: string
  ) => {
    setModal({ type, parentId });
    setName("");
    setDesc("");
  };

  const closeModal = () => setModal({ type: null });

  const handleSave = async () => {
    if (modal.type === "add-pillar") {
      await addPillar({
        name,
        description: desc,
        sort_order: pillars.length + 1,
      });
    } else if (modal.type === "add-theme" && modal.parentId) {
      const pillar = pillars.find((p) => p.id === modal.parentId);
      const count = pillar?.themes?.length ?? 0;
      await addTheme({
        pillarId: modal.parentId,
        name,
        description: desc,
        sort_order: count + 1,
      });
    } else if (modal.type === "add-subtheme" && modal.parentId) {
      // parentId here is the theme id
      const parentTheme = pillars.flatMap((p) => p.themes).find((t) => t.id === modal.parentId);
      const count = parentTheme?.subthemes?.length ?? 0;
      await addSubtheme({
        themeId: modal.parentId,
        name,
        description: desc,
        sort_order: count + 1,
      });
    }
    closeModal();
    await loadData();
  };

  return (
    <div className="p-4">
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary" },
        ]}
        title="Primary Framework Editor"
        description="Define and manage pillars, themes, and subthemes of the SSC framework."
      />

      <div className="flex items-center justify-between mb-4">
        <div className="space-x-2">
          <Button size="sm" onClick={() => loadData()}>
            Refresh
          </Button>
          {editMode && (
            <Button size="sm" onClick={() => openModal("add-pillar")}>
              <Plus className="w-4 h-4 mr-1" /> Add Pillar
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="border rounded-lg divide-y">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                    Pillar
                  </span>{" "}
                  <span className="font-semibold">{pillar.name}</span>
                  <p className="text-sm text-gray-500">{pillar.description}</p>
                </div>
                {editMode && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openModal("add-theme", pillar.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        await deletePillar(pillar.id);
                        loadData();
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              {pillar.themes?.map((theme) => (
                <div key={theme.id} className="pl-6 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                        Theme
                      </span>{" "}
                      <span className="font-semibold">{theme.name}</span>
                      <p className="text-sm text-gray-500">{theme.description}</p>
