// /components/ui/ToolsetHeader.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon?: ReactNode;   // ✅ new prop for group icons
  breadcrumbs: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset title */}
      <h1 className="flex items-center text-2xl font-bold text-gray-800">
        <span className="text-rust-600 mr-2"> {/* Rust color main layers icon */}
          {/* Always layers icon for the toolset */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l8.485 4.243-8.485 4.242L3.515 7.243 12 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.515 12.757L12 17l8.485-4.243M3.515 17.757L12 22l8.485-4.243"
            />
          </svg>
        </span>
        Shelter and Settlement Severity Classification Toolset
      </h1>

      {/* Group with optional icon */}
      <h2 className="flex items-center mt-2 text-lg font-semibold text-gray-700">
        {groupIcon && <span className="mr-2">{groupIcon}</span>}
        {group}
      </h2>

      {/* Page title + description */}
      <div className="mt-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="mt-2 text-sm text-rust-600">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx}>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              crumb.label
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </header>
  );
}
