"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const [expandedPillars, setExpandedPillars] = useState<string[]>([]);
  const [expandedThemes, setExpandedThemes] = useState<string[]>([]);

  const togglePillar = (id: string) => {
    setExpandedPillars(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const toggleTheme = (id: string) => {
    setExpandedThemes(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-700">
              <th className="px-4 py-2 w-1/6">Type / Ref Code</th>
              <th className="px-4 py-2 w-3/6">Name / Description</th>
              <th className="px-4 py-2 w-1/6 text-center">Sort Order</th>
              <th className="px-4 py-2 w-1/6 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {framework.map((pillar) => (
              <>
                <tr key={pillar.id} className="border-b">
                  <td className="px-4 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePillar(pillar.id)}>
                        {expandedPillars.includes(pillar.id) ? (
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
                  <td className="px-4 py-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-xs text-gray-500">
                      {pillar.description}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
                  <td className="px-4 py-2 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Edit size={16} className="cursor-pointer text-blue-500" />
                      <Trash2 size={16} className="cursor-pointer text-red-500" />
                    </div>
                  </td>
                </tr>

                {expandedPillars.includes(pillar.id) &&
                  pillar.themes?.map((theme: Theme) => (
                    <>
                      <tr
                        key={theme.id}
                        className="border-b bg-gray-50"
                      >
                        <td className="px-4 py-2 align-top">
                          <div className="flex items-center gap-2 pl-6">
                            <button onClick={() => toggleTheme(theme.id)}>
                              {expandedThemes.includes(theme.id) ? (
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
                        <td className="px-4 py-2">
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs text-gray-500">
                            {theme.description}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {theme.sort_order}
                        </td>
                        <td className="px-4 py-2 text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Edit
                              size={16}
                              className="cursor-pointer text-blue-500"
                            />
                            <Trash2
                              size={16}
                              className="cursor-pointer text-red-500"
                            />
                          </div>
                        </td>
                      </tr>

                      {expandedThemes.includes(theme.id) &&
                        theme.subthemes?.map((sub: Subtheme) => (
                          <tr key={sub.id} className="border-b">
                            <td className="px-4 py-2 align-top">
                              <div className="flex items-center gap-2 pl-12">
                                <Badge variant="danger">Subtheme</Badge>
                                <span className="text-xs text-gray-500">
                                  {sub.sort_order}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="font-medium">{sub.name}</div>
                              <div className="text-xs text-gray-500">
                                {sub.description}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              {sub.sort_order}
                            </td>
                            <td className="px-4 py-2 text-right pr-6">
                              <div className="flex justify-end gap-2">
                                <Edit
                                  size={16}
                                  className="cursor-pointer text-blue-500"
                                />
                                <Trash2
                                  size={16}
                                  className="cursor-pointer text-red-500"
                                />
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
      </CardContent>
    </Card>
  );
}
