"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Upload, Download } from "lucide-react";

type Pillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export default function PrimaryFrameworkEditorClient() {
  const supabase = createClient();
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pillars only
  useEffect(() => {
    async function fetchPillars() {
      const { data, error } = await supabase
        .from("pillars")
        .select("id, ref_code, name, description, sort_order")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching pillars:", error);
      } else {
        setPillars(data || []);
      }
      setLoading(false);
    }
    fetchPillars();
  }, [supabase]);

  return (
    <div className="space-y-6">
      {/* Bulk actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" /> Upload CSV
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Download CSV
        </Button>
      </div>

      {/* Pillars table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Type / Ref Code</th>
              <th className="px-4 py-2">Name / Description</th>
              <th className="px-4 py-2">Sort Order</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : pillars.length > 0 ? (
              pillars.map((pillar) => (
                <tr key={pillar.id} className="border-t">
                  <td className="px-4 py-3">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium mr-2">
                      Pillar
                    </span>
                    {pillar.ref_code}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{pillar.name}</div>
                    <div className="text-gray-500">{pillar.description}</div>
                  </td>
                  <td className="px-4 py-3">{pillar.sort_order}</td>
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
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No framework items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
