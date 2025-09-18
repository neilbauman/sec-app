"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Pillar } from "@/lib/framework";

type PrimaryFrameworkEditorClientProps = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({
  data,
}: PrimaryFrameworkEditorClientProps) {
  return (
    <Card>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Type / Ref Code</th>
              <th className="p-2">Name / Description</th>
              <th className="p-2">Sort Order</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pillar) => (
              <tr key={pillar.id} className="border-b hover:bg-muted/40">
                <td className="p-2">
                  <Badge variant="outline">{pillar.ref_code}</Badge>
                </td>
                <td className="p-2">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {pillar.description}
                  </div>
                </td>
                <td className="p-2">{pillar.sort_order}</td>
                <td className="p-2 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
