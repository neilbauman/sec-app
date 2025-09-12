"use client";

import React, { useState, useTransition } from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { cn } from "@/lib/utils";
import { PlusCircle, Trash2 } from "lucide-react";
import { addPillar, deletePillar } from "./actions";

type Props = {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
};

export default function PrimaryFrameworkCards({ pillars }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddPillar = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await addPillar({
          code: newCode,
          name: newName,
          description: newDescription,
          sort_order: pillars.length + 1,
        });
        window.location.reload();
      } catch (err) {
        alert("Error adding pillar: " + (err as Error).message);
      }
    });
  };

  const handleDeletePillar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pillar?")) return;
    startTransition(async () => {
      try {
        await deletePillar(id);
        window.location.reload();
      } catch (err) {
        alert("Error deleting pillar: " + (err as Error).message);
      }
    });
  };

  const renderSubtheme = (subtheme: Subtheme) => (
    <div
      key={subtheme.id}
      className="grid grid-cols-[200px_1fr_auto] items-center border-b pl-12 pr-2 py-2"
    >
      <div className="text-sm font-medium flex items-center space-x-2">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            "bg-red-100 text-red-800"
          )}
        >
          Subtheme
        </span>
        <span className="text-gray-500 text-xs">{subtheme.code}</span>
      </div>
      <div>
        <div className="font-medium">{subtheme.name}</div>
        <div className="text-xs text-gray-500">{subtheme.description}</div>
      </div>
      <div className="flex justify-end space-x-2"></div>
    </div>
  );

  const renderTheme = (theme: Theme & { subthemes: Subtheme[] }) => (
    <div key={theme.id} className="border-b">
      <div className="grid grid-cols-[200px_1fr_auto] items-center pl-6 pr-2 py-2">
        <div className="text-sm font-medium flex items-center space-x-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              "bg-green-100 text-green-800"
            )}
          >
            Theme
          </span>
          <span className="text-gray-500 text-xs">{theme.code}</span>
        </div>
        <div>
          <div className="font-medium">{theme.name}</div>
          <div className="text-xs text-gray-500">{theme.description}</div>
        </div>
        <div className="flex justify-end space-x-2"></div>
      </div>
      <div>{theme.subthemes.map(renderSubtheme)}</div>
    </div>
  );

  const renderPillar = (
    pillar: Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] }
  ) => (
    <div key={pillar.id} className="border rounded-md mb-4">
      <div className="grid grid-cols-[200px_1fr_auto] items-center p-2 bg-gray-50">
        <div className="text-sm font-medium flex items-center space-x-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              "bg-blue-100 text-blue-800"
            )}
          >
            Pillar
          </span>
          <span className="text-gray-500 text-xs">{pillar.code}</span>
        </div>
        <div>
          <div className="font-medium">{pillar.name}</div>
          <div className="text-xs text-gray-500">{pillar.description}</div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleDeletePillar(pillar.id)}
            disabled={isPending}
            className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
            title="Delete Pillar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div>{pillar.themes.map(renderTheme)}</div>
    </div>
  );

  return (
    <div className="border rounded-md divide-y space-y-4">
      {/* Add Pillar Button */}
      <div className="p-2 flex justify-between items-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={16} />
          <span>Add Pillar</span>
        </button>
      </div>

      {/* Add Pillar Form */}
      {showAddForm && (
        <form onSubmit={handleAddPillar} className="p-4 space-y-2 bg-gray-50 border rounded-md">
          <input
            type="text"
            placeholder="Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Render Pillars */}
      {pillars.map(renderPillar)}
    </div>
  );
}
