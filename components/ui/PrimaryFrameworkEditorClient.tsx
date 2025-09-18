// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  framework: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="px-4 py-2 w-1/6">Type / Ref Code</th>
                <th className="px-4 py-2 w-3/6">Name / Description</th>
                <th className="px-4 py-2 text-center w-1/6">Sort Order</th>
                <th className="px-4 py-2 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {framework.map((pillar) => (
                <>
                  <tr key={pillar.id} className="border-t">
                    <td className="px-4 py-2 align-top">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleExpand(pillar.id)}>
                          {expanded[pillar.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <Badge variant="default">Pillar</Badge>
                        <span className="text-xs text-gray-500">
                          {pillar.sort_order}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-gray-500">{pillar.description}</div>
                    </td>
                    <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
                        <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
                      </div>
                    </td>
                  </tr>

                  {expanded[pillar.id] &&
                    pillar.themes?.map((theme: Theme) => (
                      <>
                        <tr
                          key={theme.id}
                          className="border-t bg-gray-50"
                        >
                          <td className="px-8 py-2 align-top">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleExpand(theme.id)}>
                                {expanded[theme.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <Badge variant="success">Theme</Badge>
                              <span className="text-xs text-gray-500">
                                {theme.sort_order}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 align-top">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-gray-500">
                              {theme.description}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {theme.sort_order}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
                              <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
                            </div>
                          </td>
                        </tr>

                        {expanded[theme.id] &&
                          theme.subthemes?.map((sub: Subtheme) => (
                            <tr
                              key={sub.id}
                              className="border-t bg-red-50"
                            >
                              <td className="px-12 py-2 align-top">
                                <div className="flex items-center gap-2">
                                  <Badge variant="danger">Subtheme</Badge>
                                  <span className="text-xs text-gray-500">
                                    {sub.sort_order}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 align-top">
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-gray-500">
                                  {sub.description}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center">
                                {sub.sort_order}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex gap-2">
                                  <Edit className="h-4 w-4 cursor-pointer text-blue-600" />
                                  <Trash2 className="h-4 w-4 cursor-pointer text-red-600" />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </>
                    ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
