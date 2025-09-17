// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Plus, Edit, Trash } from "lucide-react";
import type { Pillar } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [data, setData] = useState(framework);

  return (
    <div>
      <ToolHeader
        title="Primary Framework Editor"
        description="Configure pillars, themes, and sub-themes of the SSC framework."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />

      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Pillars</h2>
        <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
          <Plus className="h-4 w-4 mr-1" /> Add Pillar
        </button>
      </div>

      <table className="min-w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Sort Order</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pillar) => (
            <tr key={pillar.id} className="border-t">
              <td className="px-4 py-2">{pillar.name}</td>
              <td className="px-4 py-2">{pillar.description}</td>
              <td className="px-4 py-2">{pillar.sort_order}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
