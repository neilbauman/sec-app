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
  groupIcon: LucideIcon; // 👈 function reference, not JSX
  breadcrumbs: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon: GroupIcon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset title */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Layers className="w-6 h-6 text-rust-600" />
        <span>Shelter and Settlement Severity Classification Toolset</span>
      </div>

      {/* Group title */}
      <div className="flex items-center gap-2 text-base font-semibold mt-1">
        <GroupIcon className="w-5 h-5 text-rust-600" />
        <span>{group}</span>
      </div>

      {/* Page title + description */}
      <h1 className="text-xl font-bold mt-1">{title}</h1>
      {description && (
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      )}

      {/* Breadcrumbs */}
      <nav className="text-sm mt-2">
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={idx}>
              {bc.href && !isLast ? (
                <a
                  href={bc.href}
                  className="text-rust-600 hover:underline"
                >
                  {bc.label}
                </a>
              ) : (
                <span
                  className={`${
                    isLast ? "font-semibold text-rust-600" : "text-rust-600"
                  }`}
                >
                  {bc.label}
                </span>
              )}
              {!isLast && " / "}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
