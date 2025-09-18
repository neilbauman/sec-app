"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
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
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2 w-1/6">Type / Ref Code</th>
                <th className="px-4 py-2 w-3/6">Name / Description</th>
                <th className="px-4 py-2 text-center w-1/6">Sort Order</th>
                <th className="px-4 py-2 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {framework.map((pillar) => (
                <>
                  <tr key={pillar.id} className="border-b">
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="mr-2"
                      >
                        {expanded[pillar.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <Badge variant="default">Pillar</Badge>
                      <span className="ml-1 text-xs text-gray-500">
                        {/* ✅ Use sort_order as temporary ref code */}
                        {pillar.sort_order}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-sm text-gray-500">
                        {pillar.description}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {pillar.sort_order}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Edit size={16} className="cursor-pointer" />
                        <Trash2 size={16} className="cursor-pointer text-red-500" />
                      </div>
                    </td>
                  </tr>

                  {/* Themes */}
                  {expanded[pillar.id] &&
                    pillar.themes?.map((theme) => (
                      <>
                        <tr key={theme.id} className="border-b bg-gray-50">
                          <td className="px-8 py-2">
                            <button
                              onClick={() => toggleExpand(theme.id)}
                              className="mr-2"
                            >
                              {expanded[theme.id] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            <Badge variant="success">Theme</Badge>
                            <span className="ml-1 text-xs text-gray-500">
                              {theme.sort_order}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-sm text-gray-500">
                              {theme.description}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {theme.sort_order}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Edit size={16} className="cursor-pointer" />
                              <Trash2 size={16} className="cursor-pointer text-red-500" />
                            </div>
                          </td>
                        </tr>

                        {/* Subthemes */}
                        {expanded[theme.id] &&
                          theme.subthemes?.map((sub) => (
                            <tr key={sub.id} className="border-b bg-gray-100">
                              <td className="px-12 py-2">
                                <Badge variant="danger">Subtheme</Badge>
                                <span className="ml-1 text-xs text-gray-500">
                                  {sub.sort_order}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <div className="font-medium">{sub.name}</div>
                                <div className="text-sm text-gray-500">
                                  {sub.description}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center">
                                {sub.sort_order}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex gap-2">
                                  <Edit size={16} className="cursor-pointer" />
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
        </div>
      </CardContent>
    </Card>
  );
}
