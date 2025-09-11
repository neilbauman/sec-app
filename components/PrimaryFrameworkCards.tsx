// /components/PrimaryFrameworkCards.tsx
"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Edit, Trash, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ActionIcon } from "@/lib/ui";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: (Pillar & {
    themes?: (Theme & { subthemes?: Subtheme[] })[];
  })[];
  defaultOpen?: boolean;
};

export default function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      {pillars?.map((pillar) => (
        <div key={pillar.id} className="rounded-xl border bg-white shadow-sm">
          {/* Pillar row */}
          <div
            className="grid grid-cols-[1fr_120px_120px] items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => toggle(`pillar-${pillar.id}`)}
          >
            <div className="flex items-start gap-3">
              {open[`pillar-${pillar.id}`] ? (
                <ChevronDown size={18} className="mt-1" />
              ) : (
                <ChevronRight size={18} className="mt-1" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Tag color="blue">Pillar</Tag>
                  <span className="text-xs text-gray-500">{pillar.code}</span>
                  <span className="font-medium text-gray-900">
                    {pillar.name}
                  </span>
                </div>
                {pillar.description && (
                  <p className="text-sm text-gray-500">{pillar.description}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">{pillar.sort_order}</div>
            <div className="flex justify-end gap-2 text-gray-400">
              <ActionIcon disabled title="Edit"><Edit size={16} /></ActionIcon>
              <ActionIcon disabled title="Delete"><Trash size={16} /></ActionIcon>
              <ActionIcon disabled title="Add"><Plus size={16} /></ActionIcon>
            </div>
          </div>

          {/* Themes */}
          <AnimatePresence>
            {open[`pillar-${pillar.id}`] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-8 space-y-2 border-l pl-4"
              >
                {pillar.themes?.map((theme) => (
                  <div
                    key={theme.id}
                    className="rounded-md border bg-gray-50 shadow-sm"
                  >
                    <div
                      className="grid grid-cols-[1fr_120px_120px] items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggle(`theme-${theme.id}`)}
                    >
                      <div className="flex items-start gap-2">
                        {open[`theme-${theme.id}`] ? (
                          <ChevronDown size={16} className="mt-1" />
                        ) : (
                          <ChevronRight size={16} className="mt-1" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Tag color="green">Theme</Tag>
                            <span className="text-xs text-gray-500">
                              {theme.code}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {theme.name}
                            </span>
                          </div>
                          {theme.description && (
                            <p className="text-xs text-gray-500">
                              {theme.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {theme.sort_order}
                      </div>
                      <div className="flex justify-end gap-2 text-gray-400">
                        <ActionIcon disabled title="Edit"><Edit size={16} /></ActionIcon>
                        <ActionIcon disabled title="Delete"><Trash size={16} /></ActionIcon>
                        <ActionIcon disabled title="Add"><Plus size={16} /></ActionIcon>
                      </div>
                    </div>

                    {/* Subthemes */}
                    <AnimatePresence>
                      {open[`theme-${theme.id}`] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 space-y-1 border-l pl-3"
                        >
                          {theme.subthemes?.map((subtheme) => (
                            <div
                              key={subtheme.id}
                              className="grid grid-cols-[1fr_120px_120px] items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100"
                            >
                              <div className="flex items-center gap-2">
                                <Tag color="red">Subtheme</Tag>
                                <span className="text-xs text-gray-500">
                                  {subtheme.code}
                                </span>
                                <span className="text-sm text-gray-800">
                                  {subtheme.name}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {subtheme.sort_order}
                              </div>
                              <div className="flex justify-end gap-2 text-gray-400">
                                <ActionIcon disabled title="Edit"><Edit size={16} /></ActionIcon>
                                <ActionIcon disabled title="Delete"><Trash size={16} /></ActionIcon>
                                <ActionIcon disabled title="Add"><Plus size={16} /></ActionIcon>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
