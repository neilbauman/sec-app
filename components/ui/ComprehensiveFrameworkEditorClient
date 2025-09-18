// /components/ui/ComprehensiveFrameworkEditorClient.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Pillar, Theme, Subtheme, Indicator } from "@/types/framework";

type Framework = {
  id: number;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

export default function ComprehensiveFrameworkEditorClient({
  data,
}: {
  data: Framework[];
}) {
  return (
    <div className="space-y-4">
      {data.map((pillar) => (
        <Card key={pillar.id}>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{pillar.name}</h2>
            <p className="text-sm text-gray-600">{pillar.description}</p>
            {/* Themes */}
            {pillar.themes?.map((theme) => (
              <div key={theme.id} className="ml-4 mt-2">
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>

                {/* Subthemes */}
                {theme.subthemes?.map((subtheme) => (
                  <div key={subtheme.id} className="ml-4 mt-2">
                    <h4 className="font-medium">{subtheme.name}</h4>
                    <p className="text-sm text-gray-600">
                      {subtheme.description}
                    </p>

                    {/* Indicators */}
                    {subtheme.indicators?.map((indicator) => (
                      <div key={indicator.id} className="ml-4 mt-1">
                        <span className="text-sm">{indicator.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
