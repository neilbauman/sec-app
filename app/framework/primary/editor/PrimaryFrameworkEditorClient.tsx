"use client";

import { useState } from "react";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { PlusCircle } from "lucide-react";
import { addPillar } from "./actions"; // ✅ now exported

type Props = {
  pillars: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowAddForm(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add Pillar</span>
      </button>

      {showAddForm && (
        <form
          action={addPillar} // ✅ bind server action
          className="p-4 space-y-2 bg-gray-50 border rounded-md mt-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Pillar name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Optional description"
            className="w-full p-2 border rounded"
          />

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <PrimaryFrameworkCards pillars={pillars} />
      </div>
    </div>
  );
}
