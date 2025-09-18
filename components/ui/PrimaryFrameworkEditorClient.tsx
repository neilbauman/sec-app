"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Pillar } from "@/types/framework";

type PrimaryFrameworkEditorClientProps = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({
  data,
}: PrimaryFrameworkEditorClientProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="p-3 font-medium">Type / Ref Code</th>
              <th className="p-3 font-medium">Name / Description</th>
              <th className="p-3 font-medium">Sort Order</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pillar) => (
              <tr
                key={pillar.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="p-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Pillar
                  </Badge>
                  {pillar.ref_code}
                </td>
                <td className="p-3">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {pillar.description}
                  </div>
                </td>
                <td className="p-3">{pillar.sort_order}</td>
                <td className="p-3 flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
