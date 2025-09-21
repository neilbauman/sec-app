// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit3, X, Check } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NormalizedPillar } from "@/lib/framework-utils";
import { getSupabaseClient } from "@/lib/framework-client";  // ✅ use this

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const supabase = createClient();

  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  // --- Actions ---
  const togglePillar = (id: string) => {
    setOpenPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEdit = (pillar: NormalizedPillar) => {
    setEditingRow(pillar.id);
    setEditValues({ name: pillar.name, description: pillar.description || "" });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditValues({ name: "", description: "" });
  };

  const saveEdit = async (pillarId: string) => {
    const { error } = await supabase
      .from("pillars")
      .update({
        name: editValues.name,
        description: editValues.description,
      })
      .eq("id", pillarId);

    if (error) {
      console.error("Failed to update pillar:", error.message);
      return;
    }

    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId
          ? { ...p, name: editValues.name, description: editValues.description }
          : p
      )
    );

    setEditingRow(null);
    setEditValues({ name: "", description: "" });
  };

  // --- Render ---
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-8">
                {/* expand/collapse */}
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                Name / Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                Ref Code
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pillars.map((pillar) => {
              const isEditing = editingRow === pillar.id;

              return (
                <tr key={pillar.id}>
                  {/* Expand caret */}
                  <td className="px-4 py-2 align-top">
                    <button
                      onClick={() => togglePillar(pillar.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {openPillars[pillar.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Name + Description */}
                  <td className="px-4 py-2 align-top">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, name: e.target.value }))
                          }
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                        <textarea
                          value={editValues.description}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, description: e.target.value }))
                          }
                          className="w-full border rounded px-2 py-1 text-xs text-gray-600"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{pillar.name}</div>
                        {pillar.description && (
                          <div className="text-sm text-gray-500">{pillar.description}</div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-2 align-top">
                    <Badge>Pillar</Badge>
                  </td>

                  {/* Ref Code */}
                  <td className="px-4 py-2 align-top text-gray-500 text-sm">
                    {pillar.ref_code}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 align-top text-right space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => saveEdit(pillar.id)}
                        >
                          <Check className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(pillar)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
