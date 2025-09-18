// /components/ui/ToolHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ToolHeaderProps = {
  group?: string;
  groupIcon?: LucideIcon;
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  actions?: { label: string }[]; // ✅ allow static actions
};

export function ToolHeader({
  group,
  groupIcon: GroupIcon,
  title,
  description,
  breadcrumbs,
  actions,
}: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Global toolset title */}
      <div className="flex items-center space-x-2 mb-2">
        <Layers className="w-5 h-5 text-orange-700" />
        <h1 className="text-lg font-bold text-gray-900">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group row (optional) */}
      {group && (
        <div className="flex items-center space-x-2 mb-2">
          {GroupIcon && <GroupIcon className="w-4 h-4 text-gray-600" />}
          <h2 className="text-md font-semibold text-gray-700">{group}</h2>
        </div>
      )}

      {/* Page title + description + static actions */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((a, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs font-medium text-gray-700 border rounded bg-gray-100"
              >
                {a.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 space-x-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {crumb.href ? (
              <Link href={crumb.href} className="text-blue-600 hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </div>
    </div>
  );
}
