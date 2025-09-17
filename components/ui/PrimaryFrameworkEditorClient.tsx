"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Plus, Trash } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";

interface FrameworkRow {
  id: string;
  ref_code: string;
  title: string;
  description: string;
  sort_order: number;
}

export default function PrimaryFrameworkEditorClient() {
  const [rows, setRows] = useState<FrameworkRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("frameworks")
        .select("*")
        .order("sort_order");
      if (error) console.error(error);
      else setRows(data as FrameworkRow[]);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Primary Framework Editor"
        pageDescription="Configure pillars, themes, and sub-themes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="configuration"
      />

      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <Button>
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Row
        </Button>
      </div>

      <table className="min-w-full border border-gray-200 bg-white rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Order</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{item.ref_code}</td>
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{item.sort_order}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
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
  );
}
