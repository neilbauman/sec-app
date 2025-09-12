"use client";

import React, { useState } from "react";
import { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { PlusCircle } from "lucide-react";
import { addPillar } from "./actions";

type Props = {
  pillars: Pillar[];
  error?: string;
};

export default function PrimaryFrameworkEditorClient({ pillars, error }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);

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
          action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;
            await addPillar({ name, description });
          }}
          className="p-4 space-y-2 bg-gray-50 border rounded-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Name (optional)"
            className="w-full border px-2 py-1 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border px-2 py-1 rounded"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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
