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
  const [items, setItems] = useState<FrameworkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/frameworks/primary");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: FrameworkItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching framework data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading framework data…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-medium">Type / Ref Code</th>
            <th className="px-4 py-2 font-medium">Name / Description</th>
            <th className="px-4 py-2 font-medium">Sort Order</th>
            <th className="px-4 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                No framework items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {item.type}
                  </span>{" "}
                  {item.ref_code}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">{item.description}</div>
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
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
