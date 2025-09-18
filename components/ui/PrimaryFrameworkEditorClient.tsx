"use client";

import { useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({});
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) => {
    setExpandedPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTheme = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {framework
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((pillar) => (
          <Card key={pillar.id} className="shadow-md">
            <CardHeader
              className="flex items-center justify-between cursor-pointer"
              onClick={() => togglePillar(pillar.id)}
            >
              <div className="flex items-center space-x-3">
                {expandedPillars[pillar.id] ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <CardTitle className="text-lg font-semibold">
                  {pillar.sort_order}. {pillar.name}
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Pillar
              </Badge>
            </CardHeader>
            {expandedPillars[pillar.id] && (
              <CardContent className="space-y-4 pl-8">
                <p className="text-sm text-gray-600">{pillar.description}</p>
                {pillar.themes
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((theme) => (
                    <div key={theme.id} className="border-l-2 border-gray-200 pl-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleTheme(theme.id)}
                      >
                        <div className="flex items-center space-x-2">
                          {expandedThemes[theme.id] ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {pillar.sort_order}.{theme.sort_order} {theme.name}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Theme
                        </Badge>
                      </div>
                      {expandedThemes[theme.id] && (
                        <div className="pl-6 mt-2 space-y-2">
                          <p className="text-sm text-gray-600">{theme.description}</p>
                          {theme.subthemes
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((subtheme) => (
                              <div
                                key={subtheme.id}
                                className="flex items-center justify-between pl-4 border-l border-gray-200"
                              >
                                <span className="text-sm">
                                  {pillar.sort_order}.{theme.sort_order}.
                                  {subtheme.sort_order} {subtheme.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-yellow-100 text-yellow-700"
                                >
                                  Subtheme
                                </Badge>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </CardContent>
            )}
          </Card>
        ))}
    </div>
  );
}
