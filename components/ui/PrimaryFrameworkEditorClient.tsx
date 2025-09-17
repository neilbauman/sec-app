// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useEffect, useState } from "react";
import { Pillar } from "@/types/framework";
import { getFramework } from "@/lib/framework";
import { Button } from "@/components/ui/button";
import { Download, Upload, Edit, Plus, Trash, ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";
import { ToolHeader } from "@/components/ui/ToolHeader"; // ✅ fixed import

interface NodeState {
  [id: string]: boolean;
}

export default function PrimaryFrameworkEditorClient() {
  const [data, setData] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<NodeState>({});

  useEffect(() => {
    async function fetchData() {
      const framework = await getFramework();
      setData(framework);
    }
    fetchData();
  }, []);

  const toggleNode = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <ToolHeader title="Primary Framework Editor" group="Configuration" /> {/* ✅ consistent */}

      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Pillar
          </Button>
          <Button variant="secondary" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Ref Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Sort Order</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pillar) => (
            <tr key={pillar.id} className="border-t">
              <td className="px-4 py-2">{pillar.ref_code}</td>
              <td className="px-4 py-2">{pillar.name}</td>
              <td className="px-4 py-2">{pillar.description}</td>
              <td className="px-4 py-2">{pillar.sort_order}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => toggleNode(pillar.id)}>
                  {expanded[pillar.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
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
