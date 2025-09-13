"use client";

import { useState } from "react";
import { addPillar } from "./actions";
import { PlusCircle } from "lucide-react";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar } from "@/types/pillar";

type Props = {
  pillars: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pillars</h2>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" />
          Add Pillar
        </button>
      </div>

      {showAddForm && (
        <form
          action={addPillar} // ✅ Now directly passes FormData
          className="p-4 space-y-2 bg-gray-50 border rounded-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </form>
      )}

      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
