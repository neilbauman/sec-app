// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Pillar } from "@/types/framework";
import { getFramework } from "@/lib/framework";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Plus, Trash, ChevronRight, ChevronDown } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    async function fetchData() {
      const framework = await getFramework();
      setPillars(framework);
    }
    fetchData();
  }, []);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Primary Framework Editor"
        pageDescription="Configure pillars, themes, and sub-themes."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="configuration"
      />

      {/* Bulk actions */}
      <div className="flex gap-2">
        <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload CSV</Button>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download CSV</Button>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Type / Ref Code</th>
              <th className="px-4 py-2">Name / Description</th>
              <th className="px-4 py-2">Sort Order</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pillars.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No framework items found.
                </td>
              </tr>
            ) : (
              pillars.map(pillar => (
                <tr key={pillar.id} className="border-t">
                  <td className="px-4 py-2">Pillar {pillar.ref_code}</td>
                  <td className="px-4 py-2">
                    <strong>{pillar.name}</strong>
                    <div className="text-sm text-gray-500">{pillar.description}</div>
                  </td>
                  <td className="px-4 py-2">{pillar.sort_order}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
