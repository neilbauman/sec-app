"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Upload, Download, Edit, Trash, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const disabledActions = (
    <div className="flex justify-end gap-2 text-gray-400">
      <Edit size={16} />
      <Trash size={16} />
      <Plus size={16} />
    </div>
  );

  return (
    <div className="space-y-4">
      {pillars?.map((pillar) => (
        <div
          key={pillar.id}
          className="rounded-xl border bg-white shadow-sm transition hover:shadow-md"
        >
          {/* Pillar Row */}
          <div
            className="grid cursor-pointer grid-cols-[1fr_120px_120px] items-center gap-4 px-4 py-3 hover:bg-gray-50"
            onClick={() => toggle(`pillar-${pillar.id}`)}
          >
            {/* Name / Description */}
            <div className="flex items-start gap-3">
              {open[`pillar-${pillar.id}`] ? (
                <ChevronDown size={18} className="mt-1" />
              ) : (
                <ChevronRight size={18} className="mt-1" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-800">
                    Pillar
                  </span>
                  <span className="text-xs text-gray-500">
                    {pillar.code}
                  </span>
                  <span className="font-medium text-gray-900">
                    {pillar.name}
                  </span>
                </div>
                {pillar.description && (
                  <p className="text-sm text-gray-500">{pillar.description}</p>
                )}
              </div>
            </div>

            {/* Sort Order */}
            <div className="text-sm text-gray-500">P{pillar.sort_order}</div>

            {/* Actions */}
            {disabledActions}
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
                    className="rounded-md border bg-gray-50 shadow-sm transition hover:shadow"
                  >
                    {/* Theme Row */}
                    <div
                      className="grid cursor-pointer grid-cols-[1fr_120px_120px] items-center gap-3 px-3 py-2 hover:bg-gray-100"
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
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Theme
                            </span>
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
                        T{theme.sort_order}
                      </div>
                      {disabledActions}
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
                                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                  Subtheme
                                </span>
                                <span className="text-xs text-gray-500">
                                  {subtheme.code}
                                </span>
                                <span className="text-sm text-gray-800">
                                  {subtheme.name}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                ST{subtheme.sort_order}
                              </div>
                              {disabledActions}
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
