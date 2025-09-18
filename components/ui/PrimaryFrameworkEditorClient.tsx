// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  framework: Pillar[];
};

export function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 w-1/5">Type / Ref Code</th>
              <th className="p-2 w-3/5">Name / Description</th>
              <th className="p-2 text-center w-1/10">Sort Order</th>
              <th className="p-2 text-center w-1/10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {framework.map((pillar) => (
              <>
                {/* Pillar Row */}
                <tr key={pillar.id} className="border-b">
                  <td className="p-2 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="focus:outline-none"
                      >
                        {expanded[pillar.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge variant="default">Pillar</Badge>
                      <span className="text-xs text-gray-500">
                        {pillar.sort_order}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-sm text-gray-500">
                      {pillar.description}
                    </div>
                  </td>
                  <td className="p-2 text-center">{pillar.sort_order}</td>
                  <td className="p-2 text-center flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>

                {/* Themes under Pillar */}
                {expanded[pillar.id] &&
                  pillar.themes?.map((theme: Theme) => (
                    <>
                      <tr key={theme.id} className="border-b bg-gray-50">
                        <td className="p-2 pl-8 align-top">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(theme.id)}
                              className="focus:outline-none"
                            >
                              {expanded[theme.id] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            <Badge variant="success">Theme</Badge>
                            <span className="text-xs text-gray-500">
                              {theme.sort_order}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-gray-500">
                            {theme.description}
                          </div>
                        </td>
                        <td className="p-2 text-center">{theme.sort_order}</td>
                        <td className="p-2 text-center flex justify-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>

                      {/* Subthemes under Theme */}
                      {expanded[theme.id] &&
                        theme.subthemes?.map((sub: Subtheme) => (
                          <tr key={sub.id} className="border-b bg-gray-100">
                            <td className="p-2 pl-16 align-top">
                              <div className="flex items-center gap-2">
                                <Badge variant="danger">Subtheme</Badge>
                                <span className="text-xs text-gray-500">
                                  {sub.sort_order}
                                </span>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium">{sub.name}</div>
                              <div className="text-sm text-gray-500">
                                {sub.description}
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              {sub.sort_order}
                            </td>
                            <td className="p-2 text-center flex justify-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit size={16} />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
