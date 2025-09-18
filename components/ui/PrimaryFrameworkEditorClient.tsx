"use client";

// UI-only pass (B): ref code uses sort_order; compact bulk-edit controls;
// tighter caret/tag spacing; wider Name/Description; centered Sort Order.

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  data: Pillar[];
};

export default function PrimaryFrameworkEditorClient({ data }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="space-y-3">
      {/* compact bulk editing controls */}
      <div className="flex justify-end items-center gap-2 -mt-2">
        <Button size="sm" onClick={() => alert("Import not ready yet")}>
          Import CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => alert("Export not ready yet")}>
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* header */}
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-gray-500">
            <div className="col-span-3">Type / Ref Code</div>
            <div className="col-span-7">Name / Description</div>
            <div className="col-span-1 text-center">Sort Order</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* rows */}
          <div className="divide-y">
            {data
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((pillar) => (
                <div key={pillar.id} className="px-4 py-3">
                  <div className="grid grid-cols-12 items-start">
                    {/* type / ref code */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => toggle(pillar.id)}
                          aria-label={expanded[pillar.id] ? "Collapse" : "Expand"}
                        >
                          {expanded[pillar.id] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                        <div className="flex items-center gap-1">
                          <Badge>Pillar</Badge>
                          <span className="text-xs text-gray-500">{pillar.sort_order}</span>
                        </div>
                      </div>
                    </div>

                    {/* name / description */}
                    <div className="col-span-7">
                      <div className="font-medium">{pillar.name}</div>
                      <div className="text-xs text-gray-600">{pillar.description}</div>
                    </div>

                    {/* sort order */}
                    <div className="col-span-1 text-center text-sm">{pillar.sort_order}</div>

                    {/* actions */}
                    <div className="col-span-1">
                      <div className="flex justify-end items-center gap-3 text-gray-500">
                        <button className="hover:text-gray-700" aria-label="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="hover:text-red-600" aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* themes (UI only; placement unchanged for this pass) */}
                  {expanded[pillar.id] &&
                    pillar.themes
                      ?.slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((theme: Theme) => (
                        <div key={theme.id} className="mt-3 ml-6">
                          <div className="grid grid-cols-12 items-start">
                            <div className="col-span-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => toggle(theme.id)}
                                  aria-label={expanded[theme.id] ? "Collapse" : "Expand"}
                                >
                                  {expanded[theme.id] ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </button>
                                <div className="flex items-center gap-1">
                                  <Badge variant="success">Theme</Badge>
                                  <span className="text-xs text-gray-500">{theme.sort_order}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-7">
                              <div className="font-medium">{theme.name}</div>
                              <div className="text-xs text-gray-600">{theme.description}</div>
                            </div>

                            <div className="col-span-1 text-center text-sm">{theme.sort_order}</div>

                            <div className="col-span-1">
                              <div className="flex justify-end items-center gap-3 text-gray-500">
                                <button className="hover:text-gray-700" aria-label="Edit">
                                  <Edit size={16} />
                                </button>
                                <button className="hover:text-red-600" aria-label="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* subthemes (still rendered after themes for this pass) */}
                          {expanded[theme.id] &&
                            theme.subthemes
                              ?.slice()
                              .sort((a, b) => a.sort_order - b.sort_order)
                              .map((sub: Subtheme) => (
                                <div key={sub.id} className="mt-3 ml-10">
                                  <div className="grid grid-cols-12 items-start">
                                    <div className="col-span-3">
                                      <div className="flex items-center gap-1">
                                        <span className="inline-flex items-center gap-1">
                                          <Badge variant="danger">Subtheme</Badge>
                                          <span className="text-xs text-gray-500">
                                            {sub.sort_order}
                                          </span>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="col-span-7">
                                      <div className="font-medium">{sub.name}</div>
                                      <div className="text-xs text-gray-600">{sub.description}</div>
                                    </div>

                                    <div className="col-span-1 text-center text-sm">
                                      {sub.sort_order}
                                    </div>

                                    <div className="col-span-1">
                                      <div className="flex justify-end items-center gap-3 text-gray-500">
                                        <button className="hover:text-gray-700" aria-label="Edit">
                                          <Edit size={16} />
                                        </button>
                                        <button className="hover:text-red-600" aria-label="Delete">
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                        </div>
                      ))}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
