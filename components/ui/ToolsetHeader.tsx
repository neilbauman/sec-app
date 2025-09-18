// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Breadcrumb } from "@/lib/breadcrumbs";

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: LucideIcon; // ✅ allow an icon prop
};

export function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  icon: GroupIcon,
}: ToolsetHeaderProps) {
  return (
    <header className="space-y-4">
      {/* Toolset title */}
      <div className="flex items-center gap-2">
        <Layers className="h-6 w-6 text-orange-600" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group section */}
      <div className="flex items-center gap-2">
        {GroupIcon && <GroupIcon className="h-5 w-5 text-gray-600" />}
        <h2 className="text-xl font-semibold">{group}</h2>
      </div>

      {/* Page title */}
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
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
    </header>
  );
}
