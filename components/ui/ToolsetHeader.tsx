// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: React.ReactNode;
  actions?: { label: string }[];
};

function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  icon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center space-x-2">
        {icon || <Layers className="w-6 h-6 text-orange-600" />}
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>
      <h2 className="text-lg font-semibold mt-2">{group}</h2>
      <h3 className="text-2xl font-bold">{title}</h3>
      {description && (
        <p className="text-gray-600 mt-1">{description}</p>
      )}
      <nav className="text-sm text-gray-500 mt-2">
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
      {actions && actions.length > 0 && (
        <div className="mt-2 flex space-x-2">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default ToolsetHeader;
