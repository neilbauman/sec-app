// /components/ui/ToolHeader.tsx
"use client";

import { Breadcrumb } from "@/lib/breadcrumbs";

export interface ToolHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  group: string;
  groupIcon?: React.ReactNode;
}

export function ToolHeader({
  title,
  description,
  breadcrumbs,
  group,
  groupIcon,
}: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Toolset Title */}
      <div className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
        <span className="text-rust-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 17l9 4 9-4" />
            <path d="M3 12l9 4 9-4" />
          </svg>
        </span>
        <span>Shelter and Settlement Severity Classification Toolset</span>
      </div>

      {/* Group */}
      <div className="flex items-center mt-2 space-x-2 text-gray-600">
        {groupIcon && <span className="text-teal-600">{groupIcon}</span>}
        <span className="font-medium">{group}</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      {description && (
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      )}

      {/* Breadcrumbs */}
      <div className="text-sm text-blue-600 mt-2 space-x-1">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx}>
            <a href={crumb.href} className="hover:underline">
              {crumb.label}
            </a>
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </div>
    </div>
  );
}
