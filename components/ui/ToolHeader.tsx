// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface ToolsetHeaderProps {
  groupTitle: string;
  groupIcon: LucideIcon;
  groupColor: string; // e.g. "text-emerald-600"
  pageTitle: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
}

export function ToolsetHeader({
  groupTitle,
  groupIcon: GroupIcon,
  groupColor,
  pageTitle,
  description,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <div className="mb-6">
      {/* Global toolset title */}
      <div className="flex items-center space-x-2 mb-2">
        <Layers className="h-6 w-6 text-orange-700" />
        <h1 className="text-xl font-semibold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group title with themed icon */}
      <div className="flex items-center space-x-2 mb-1">
        <GroupIcon className={`h-5 w-5 ${groupColor}`} />
        <span className={`text-sm font-medium ${groupColor}`}>
          {groupTitle}
        </span>
      </div>

      {/* Page title + description */}
      <h2 className="text-lg font-semibold">{pageTitle}</h2>
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx}>
            {bc.href ? (
              <Link href={bc.href} className="text-blue-600 hover:underline">
                {bc.label}
              </Link>
            ) : (
              bc.label
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </div>
  );
}
