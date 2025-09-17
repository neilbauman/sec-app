"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";

interface FrameworkItem {
  id: string;
  type: string;
  ref_code?: string;
  refCode?: string;
  name: string;
  description: string;
  sort_order: number;
}

export default function PrimaryFrameworkEditorClient() {
  const [items, setItems] = useState<FrameworkItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/framework/primary");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline">Upload CSV</Button>
        <Button variant="outline">Download CSV</Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                TYPE / REF CODE
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                NAME / DESCRIPTION
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                SORT ORDER
              </th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id || item.ref_code || item.refCode}>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-blue-600">
                    {item.type || "Pillar"}
                  </span>{" "}
                  {item.ref_code || item.refCode || item.id}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{item.sort_order}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
