"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";

type Subtheme = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

type Theme = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
};

type Pillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent className="p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Type / Ref Code
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Name / Description
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                Sort Order
              </th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((pillar) => (
              <>
                {/* Pillar */}
                <tr key={pillar.id} className="bg-white">
                  <td className="px-4 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="text-gray-500 hover:text-gray-700"
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
                  <td className="px-4 py-2">
                    <div className="font-medium">{pillar.name}</div>
                    <div className="text-sm text-gray-500">{pillar.description}</div>
                  </td>
                  <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Themes */}
                {expanded[pillar.id] &&
                  pillar.themes.map((theme) => (
                    <>
                      <tr
                        key={theme.id}
                        className="bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <td className="px-8 py-2 align-top">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(theme.id)}
                              className="text-gray-500 hover:text-gray-700"
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
                        <td className="px-4 py-2">
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-gray-500">
                            {theme.description}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {theme.sort_order}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Subthemes */}
                      {expanded[theme.id] &&
                        theme.subthemes.map((sub) => (
                          <tr key={sub.id} className="bg-white">
                            <td className="px-12 py-2 align-top">
                              <div className="flex items-center gap-2">
                                <Badge variant="danger">Subtheme</Badge>
                                <span className="text-xs text-gray-500">
                                  {sub.sort_order}
                                </span>
                              </div>
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
                            <td className="px-4 py-2 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
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
