// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { Pillar } from "@/lib/framework";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  return (
    <Card>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Type / Ref Code</th>
              <th className="p-2">Name / Description</th>
              <th className="p-2">Sort Order</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pillar) => (
              <tr key={pillar.id} className="border-b">
                <td className="p-2">
                  <span className="text-sm text-muted-foreground">Pillar</span>{" "}
                  {pillar.ref_code}
                </td>
                <td className="p-2">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {pillar.description}
                  </div>
                </td>
                <td className="p-2">{pillar.sort_order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
