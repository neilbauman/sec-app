"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Subtheme } from "@/types/framework"; // ✅ Only Pillar, Subtheme
// ⚠️ Override Theme here so TypeScript knows the real shape
type Theme = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
  subthemes: Subtheme[];
};

type Framework = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
  themes: Theme[];
};

export default function ComprehensiveFrameworkEditorClient({
  data,
}: {
  data: Framework[];
}) {
  const [expandedPillars, setExpandedPillars] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedPillars((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {data.map((pillar) => (
        <Card key={pillar.id} className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button onClick={() => toggleExpand(pillar.id)}>
                  {expandedPillars.includes(pillar.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                <span className="font-semibold">
                  {pillar.ref_code} {pillar.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            {expandedPillars.includes(pillar.id) && (
              <div className="ml-6 mt-2 space-y-2">
                {pillar.themes.map((theme) => (
                  <div key={theme.id}>
                    <div className="flex items-center justify-between">
                      <span>
                        {theme.ref_code} {theme.name}
                      </span>
                    </div>
                    <div className="ml-6 text-sm text-muted-foreground">
                      {theme.subthemes?.map((sub) => (
                        <div key={sub.id}>
                          {sub.ref_code} {sub.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
