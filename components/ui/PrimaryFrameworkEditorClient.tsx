"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Edit, Plus, Trash2, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FrameworkItem {
  id: string;
  ref_code: string;
  type: string;
  name: string;
  description: string;
  sort_order: number;
}

export default function PrimaryFrameworkEditorClient() {
  const [frameworkData, setFrameworkData] = useState<FrameworkItem[]>([]);

  useEffect(() => {
    fetch("/api/framework/primary")
      .then((res) => res.json())
      .then((data) => setFrameworkData(data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Bulk actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Upload CSV
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download CSV
        </Button>
      </div>

      {/* Plain Tailwind Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Type / Ref Code</th>
              <th className="px-4 py-3 text-left">Name / Description</th>
              <th className="px-4 py-3 text-left">Sort Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {frameworkData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {item.type}
                  </span>{" "}
                  {item.ref_code}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500">{item.description}</div>
                </td>
                <td className="px-4 py-3">{item.sort_order}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
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
