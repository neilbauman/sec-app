// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  groupIcon?: LucideIcon;       // pass icon component, not JSX
  icon?: LucideIcon;            // page-specific icon
  actions?: { label: string }[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  groupIcon: GroupIcon,
  icon: PageIcon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6 border-b pb-4">
      {/* Toolset title */}
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-[#8B3100]" /> {/* rust color */}
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group title with icon */}
      <div className="mt-2 flex items-center gap-2">
        {GroupIcon && <GroupIcon className="w-5 h-5 text-gray-600" />}
        <span className="font-semibold text-gray-700">{group}</span>
      </div>

      {/* Page title */}
      <div className="mt-2 flex items-center gap-2">
        {PageIcon && <PageIcon className="w-5 h-5 text-[#8B3100]" />}
        <span className="text-lg font-semibold">{title}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}

      {/* Breadcrumbs */}
      <nav className="mt-2 text-sm flex gap-1">
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={idx} className="flex items-center gap-1">
              {bc.href && !isLast ? (
                <a href={bc.href} className="text-[#8B3100] hover:underline">
                  {bc.label}
                </a>
              ) : (
                <span
                  className={`${
                    isLast ? "font-semibold text-[#8B3100]" : "text-[#8B3100]"
                  }`}
                >
                  {bc.label}
                </span>
              )}
              {!isLast && <span className="text-gray-400">/</span>}
            </span>
          );
        })}
      </nav>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="mt-2 flex gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
