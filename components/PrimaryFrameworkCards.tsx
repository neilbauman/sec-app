"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, PenSquare, Trash2, Plus } from "lucide-react";
import { Tag, ActionIcon } from "@/lib/ui";

type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes?: Subtheme[];
};

type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
};

export function PrimaryFrameworkCards({
  pillars,
  defaultOpen = false,
  actions,
}: {
  pillars: Pillar[];
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Table headers */}
        <div className="grid grid-cols-[1fr,100px,100px] items-center gap-4 border-b px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <div>Name / Description</div>
          <div className="text-center">Sort Order</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="divide-y">
          {pillars.map((pillar) => (
            <FrameworkRow
              key={pillar.id}
              level="pillar"
              code={pillar.code}
              label={pillar.name}
              description={pillar.description}
              sortOrder={pillar.sort_order}
              defaultOpen={defaultOpen}
              childrenData={pillar.themes}
              actions={actions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameworkRow<T extends { id: string; code: string; name: string; description: string | null; sort_order: number }>({
  level,
  code,
  label,
  description,
  sortOrder,
  defaultOpen,
  childrenData,
  actions,
}: {
  level: "pillar" | "theme" | "subtheme";
  code: string;
  label: string;
  description: string | null;
  sortOrder: number;
  defaultOpen?: boolean;
  childrenData?: T[];
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const color =
    level === "pillar" ? "blue" : level === "theme" ? "green" : "red";

  return (
    <div className="grid grid-cols-[1fr,100px,100px] items-center gap-4 px-2 py-2 text-sm">
      {/* Name / Description cell */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {childrenData && childrenData.length > 0 && (
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          <Tag color={color}>{level}</Tag>
          <span className="text-xs text-gray-400">{code}</span>
          <span className="font-medium">{label}</span>
        </div>
        {description && (
          <div className="ml-8 text-xs text-gray-500">{description}</div>
        )}
      </div>

      {/* Sort Order */}
      <div className="text-center text-sm text-gray-700">{sortOrder}</div>

      {/* Actions */}
      <div className="flex justify-center gap-2">
        <ActionIcon title="Edit" disabled>
          <PenSquare className="h-4 w-4" />
        </ActionIcon>
        <ActionIcon title="Delete" disabled>
          <Trash2 className="h-4 w-4" />
        </ActionIcon>
        <ActionIcon title="Add" disabled>
          <Plus className="h-4 w-4" />
        </ActionIcon>
      </div>

      {/* Nested children */}
      {childrenData && open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="col-span-3 ml-6 border-l pl-4"
        >
          {childrenData.map((child) => (
            <FrameworkRow
              key={child.id}
              level={
                level === "pillar"
                  ? "theme"
                  : level === "theme"
                  ? "subtheme"
                  : "subtheme"
              }
              code={child.code}
              label={child.name}
              description={child.description}
              sortOrder={child.sort_order}
              defaultOpen={defaultOpen}
              // @ts-expect-error narrowing hierarchy
              childrenData={child.themes || child.subthemes}
              actions={actions}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default PrimaryFrameworkCards;
