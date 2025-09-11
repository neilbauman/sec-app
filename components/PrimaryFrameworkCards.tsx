"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Upload, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

type Props = {
  pillars: (Pillar & {
    themes?: (Theme & { subthemes?: Subtheme[] })[];
  })[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
};

export default function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: Props) {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-semibold">Framework Hierarchy</h2>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-100">
            <Upload size={16} />
            Import CSV
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-100">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Hierarchy */}
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
              {/* Name/Description */}
              <div className="flex items-center gap-3">
                {open[`pillar-${pillar.id}`] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-800">
                  Pillar
                </span>
                <div>
                  <p className="font-medium text-gray-900">{pillar.name}</p>
                  {pillar.description && (
                    <p className="text-sm text-gray-500">{pillar.description}</p>
                  )}
                </div>
              </div>

              {/* Sort Order */}
              <div className="text-sm text-gray-500">P{pillar.sort_order}</div>

              {/* Actions */}
              <div className="text-right">{actions}</div>
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
                  {pillar.themes && pillar.themes.length > 0 ? (
                    pillar.themes.map((theme) => (
                      <div
                        key={theme.id}
                        className="rounded-md border bg-gray-50 shadow-sm transition hover:shadow"
                      >
                        {/* Theme Row */}
                        <div
                          className="grid cursor-pointer grid-cols-[1fr_120px_120px] items-center gap-3 px-3 py-2 hover:bg-gray-100"
                          onClick={() => toggle(`theme-${theme.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            {open[`theme-${theme.id}`] ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Theme
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {theme.name}
                              </p>
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
                          <div className="text-right">{actions}</div>
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
                              {theme.subthemes &&
                              theme.subthemes.length > 0 ? (
                                theme.subthemes.map((subtheme) => (
                                  <div
                                    key={subtheme.id}
                                    className="grid grid-cols-[1fr_120px_120px] items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                        Subtheme
                                      </span>
                                      <div>
                                        <p className="text-sm text-gray-800">
                                          {subtheme.name}
                                        </p>
                                        {subtheme.description && (
                                          <p className="text-xs text-gray-500">
                                            {subtheme.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ST{subtheme.sort_order}
                                    </div>
                                    <div className="text-right">{actions}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm italic text-gray-500">
                                  ⚠ No subthemes
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">
                      ⚠ No themes linked
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
