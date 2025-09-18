// /components/ui/ToolHeader.tsx
"use client";

import React from "react";

export type Breadcrumb = { label: string; href?: string };

type ToolHeaderProps = {
  title: string;
  breadcrumbs: Breadcrumb[];
  group: string;
  actions?: { label: string; onClick: () => void }[];
};

export function ToolHeader({ title, breadcrumbs, group, actions }: ToolHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b pb-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500">{group}</p>
      <nav className="text-sm text-blue-600 flex gap-1">
        {breadcrumbs.map((b, i) => (
          <span key={i}>
            {b.href ? <a href={b.href}>{b.label}</a> : b.label}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
      {actions && (
        <div className="flex gap-2 mt-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
