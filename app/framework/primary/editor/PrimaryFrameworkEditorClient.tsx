"use client";

import { useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { addPillar } from "./actions";

type Props = {
  pillars: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        <PlusCircle className="w-4 h-4" />
        Add Pillar
      </button>

      {showAddForm && (
        <form
          action={async (formData: FormData) => {
            startTransition(async () => {
              await addPillar(formData);
            });
          }}
          className="p-4 space-y-2 bg-gray-50 border rounded-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Pillar name"
            required
            className="w-full px-2 py-1 border rounded"
          />
          <textarea
            name="description"
            placeholder="Optional description"
            className="w-full px-2 py-1 border rounded"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isPending ? "Adding..." : "Add Pillar"}
          </button>
        </form>
      )}

      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
