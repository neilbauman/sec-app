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
  groupIcon?: React.ReactNode;   // ✅ new
  breadcrumbs: Breadcrumb[];
  icon?: React.ReactNode;
  actions?: { label: string }[];
};

function ToolsetHeader({
  title,
  description,
  group,
  groupIcon,
  breadcrumbs,
  icon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset Title */}
      <div className="flex items-center space-x-2">
        {icon || <Layers className="w-6 h-6 text-orange-600" />}
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2 mt-2">
        {groupIcon && <span className="text-orange-600">{groupIcon}</span>}
        <h2 className="text-lg font-semibold">{group}</h2>
      </div>

      {/* Page Title */}
      <h3 className="text-2xl font-bold">{title}</h3>
      {description && (
        <p className="text-gray-600 mt-1">{description}</p>
      )}

      {/* Breadcrumbs */}
      <nav className="text-sm mt-2">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx}>
            {bc.href ? (
              <a href={bc.href} className="text-orange-600 hover:underline">
                {bc.label}
              </a>
            ) : (
              <span className="text-orange-600">{bc.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>

      {/* Actions */}
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
