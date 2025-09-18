// /components/ui/ToolHeader.tsx
"use client";

import React from "react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ToolHeaderAction = {
  label: string;
  onClick: () => void;
};

export type ToolHeaderProps = {
  title: string;
  breadcrumbs: Breadcrumb[];
  group?: string;
  actions?: ToolHeaderAction[]; // ✅ now supported
};

export function ToolHeader({ title, breadcrumbs, group, actions }: ToolHeaderProps) {
  return (
    <div className="mb-6 border-b pb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {group && <div className="text-sm text-gray-500">{group}</div>}

      <nav className="text-sm text-gray-500 mt-1">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx}>
            {crumb.href ? (
              <a href={crumb.href} className="text-blue-600 hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span>{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>

      {actions && actions.length > 0 && (
        <div className="mt-3 flex gap-2">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border text-gray-700"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
