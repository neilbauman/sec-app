// /components/PrimaryFrameworkCards.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, SquarePen, Trash2, Plus } from "lucide-react";
import { Tag, ActionIcon } from "@/lib/ui";
import { Pillar, Theme, Subtheme } from "@/types/framework";

type NestedPillar = Pillar & {
  themes?: (Theme & { subthemes?: Subtheme[] })[];
};

export function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: {
  pillars: NestedPillar[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenPillars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 text-left text-sm font-medium text-gray-600">
          <tr>
            <th className="px-4 py-3">Name / Description</th>
            <th className="px-4 py-3 w-28">Sort Order</th>
            <th className="px-4 py-3 w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm text-gray-800">
          {pillars.map((pillar) => (
            <>
              {/* Pillar row */}
              <tr key={pillar.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(pillar.id)}
                      className="mt-0.5"
                    >
                      {openPillars[pillar.id] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag color="blue">Pillar</Tag>
                        <span className="text-xs text-gray-500">{pillar.code}</span>
                        <span className="font-medium">{pillar.name}</span>
                      </div>
                      {pillar.description && (
                        <p className="text-xs text-gray-500">{pillar.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{pillar.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <ActionIcon disabled>
                      <SquarePen className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon disabled>
                      <Trash2 className="h-4 w-4" />
                    </ActionIcon>
                    <ActionIcon disabled>
                      <Plus className="h-4 w-4" />
                    </ActionIcon>
                  </div>
                </td>
              </tr>

              {/* Themes under this pillar */}
              {openPillars[pillar.id] &&
                pillar.themes?.map((theme) => (
                  <tr key={theme.id} className="align-top bg-gray-50">
                    <td className="px-10 py-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Tag color="green">Theme</Tag>
                          <span className="text-xs text-gray-500">{theme.code}</span>
                          <span className="font-medium">{theme.name}</span>
                        </div>
                        {theme.description && (
                          <p className="text-xs text-gray-500">{theme.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">{theme.sort_order}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <ActionIcon disabled>
                          <SquarePen className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon disabled>
                          <Trash2 className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon disabled>
                          <Plus className="h-4 w-4" />
                        </ActionIcon>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Subthemes under each theme */}
              {openPillars[pillar.id] &&
                pillar.themes?.flatMap((theme) =>
                  theme.subthemes?.map((subtheme) => (
                    <tr key={subtheme.id} className="align-top">
                      <td className="px-16 py-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Tag color="red">Subtheme</Tag>
                            <span className="text-xs text-gray-500">{subtheme.code}</span>
                            <span className="font-medium">{subtheme.name}</span>
                          </div>
                          {subtheme.description && (
                            <p className="text-xs text-gray-500">{subtheme.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">{subtheme.sort_order}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <ActionIcon disabled>
                            <SquarePen className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon disabled>
                            <Trash2 className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon disabled>
                            <Plus className="h-4 w-4" />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrimaryFrameworkCards;
