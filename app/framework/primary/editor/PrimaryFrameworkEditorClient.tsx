// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx

"use client";

import { useState } from "react";
import { addPillar } from "./actions";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { PlusCircle } from "lucide-react";
import type { Pillar } from "@/types/framework";

type Props = {
  pillars: Pillar[];
  error?: string; // ✅ allow error to be passed
};

export default function PrimaryFrameworkEditorClient({ pillars, error }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* ✅ Error banner */}
      {error && (
        <div className="rounded-md bg-red-100 text-red-800 p-2">
          {error}
        </div>
      )}

      {/* Add Pillar Form */}
      {showAddForm ? (
        <form
          action={async (formData: FormData) => {
            setLoading(true);
            try {
              await addPillar(formData);
            } finally {
              setLoading(false);
              setShowAddForm(false);
            }
          }}
          className="p-4 space-y-2 bg-gray-50 border rounded-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Pillar name"
            required
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="w-full p-2 border rounded-md"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Pillar"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <PlusCircle size={18} /> Add Pillar
        </button>
      )}

      {/* Render Pillars */}
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
