"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";

interface FrameworkItem {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  type: string;
}

export default function PrimaryFrameworkEditorClient() {
  const [framework, setFramework] = useState<FrameworkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/frameworks/primary");
        if (!res.ok) throw new Error("Failed to fetch framework");
        const data: FrameworkItem[] = await res.json();
        setFramework(data);
      } catch (err) {
        console.error("Error loading framework:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (framework.length === 0) {
    return (
      <p className="text-sm text-gray-500 p-4">
        No framework items found.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse border rounded-md text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-2">Type / Ref Code</th>
          <th className="px-4 py-2">Name / Description</th>
          <th className="px-4 py-2">Sort Order</th>
          <th className="px-4 py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {framework.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="px-4 py-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                {item.type}
              </span>{" "}
              {item.ref_code}
            </td>
            <td className="px-4 py-2">
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-600 text-sm">{item.description}</div>
            </td>
            <td className="px-4 py-2">{item.sort_order}</td>
            <td className="px-4 py-2 text-right space-x-2">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
