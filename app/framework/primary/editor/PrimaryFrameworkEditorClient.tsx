"use client";

import React, { useState, useTransition } from "react";
import { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { PlusCircle } from "lucide-react";
import { addPillar } from "./actions";

type Props = {
  pillars: Pillar[];
  error?: string;
};

export default function PrimaryFrameworkEditorClient({ pillars, error }: Props) {
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
        <p className="font-medium">Error loading framework data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm border rounded-md">
        No framework data found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Pillar Section */}
      <div className="flex justify-start">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={16} />
          <span>Add Pillar</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddPillar}
          className="p-4 space-y-2 bg-gray-50 border rounded-md"
        >
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

      {/* Existing Framework Cards */}
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
