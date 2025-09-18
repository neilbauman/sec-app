// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: LucideIcon;          // ✅ group-level icon (inherits group color)
  actions?: { label: string }[]; // ✅ optional actions
};

export default function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  icon: GroupIcon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset title */}
      <div className="flex items-center space-x-2 mb-2">
        <Layers className="w-6 h-6 text-rust-600" />
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group title */}
      <div className="flex items-center space-x-2 mb-2">
        {GroupIcon && <GroupIcon className="w-5 h-5 text-gray-600" />}
        <h2 className="text-lg font-semibold">{group}</h2>
      </div>

      {/* Page title + description */}
      <div className="mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Breadcrumbs */}
      <nav className="text-sm text-rust-600 mb-2">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx}>
            {bc.href ? (
              <a href={bc.href} className="hover:underline">
                {bc.label}
              </a>
            ) : (
              bc.label
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>

      {/* Actions */}
      {actions && (
        <div className="flex space-x-2 mt-2">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
