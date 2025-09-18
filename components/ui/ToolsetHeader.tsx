"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

export type Breadcrumb = { label: string; href?: string };

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  icon?: LucideIcon;              // ✅ accepts a LucideIcon ref
  breadcrumbs: Breadcrumb[];
  actions?: { label: string }[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  icon: Icon,
  breadcrumbs,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset Title */}
      <div className="flex items-center space-x-2 text-rust-600 font-bold text-xl">
        <span className="text-rust-600">
          <Icon className="w-6 h-6" />
        </span>
        <h1>Shelter and Settlement Severity Classification Toolset</h1>
      </div>

      {/* Group Title with icon if provided */}
      <div className="flex items-center mt-2 space-x-2 text-gray-700 text-lg font-semibold">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <span>{group}</span>
      </div>

      {/* Page Title + Description */}
      <h2 className="text-2xl font-bold mt-1">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}

      {/* Breadcrumbs */}
      <nav className="mt-2 text-sm text-rust-600">
        {breadcrumbs.map((bc, i) => (
          <span key={i}>
            {bc.href ? (
              <a href={bc.href} className="hover:underline">
                {bc.label}
              </a>
            ) : (
              <span>{bc.label}</span>
            )}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="mt-4 flex space-x-2">
          {actions.map((a, i) => (
            <button
              key={i}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
