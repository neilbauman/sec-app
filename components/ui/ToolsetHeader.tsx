// components/ui/ToolsetHeader.tsx
"use client";

import { Layers, Info, Settings, Globe, Database } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: "About" | "Configuration" | "Country Configurations" | "Instances";
  breadcrumbs: Breadcrumb[];
  actions?: { label: string; onClick?: () => void }[];
};

const groupConfig = {
  About: { icon: Info, color: "text-blue-600" },
  Configuration: { icon: Settings, color: "text-emerald-600" },
  "Country Configurations": { icon: Globe, color: "text-indigo-600" },
  Instances: { icon: Database, color: "text-orange-600" },
};

export function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  actions,
}: ToolsetHeaderProps) {
  const GroupIcon = groupConfig[group].icon;
  const groupColor = groupConfig[group].color;

  return (
    <header className="mb-6 border-b border-gray-200 pb-4">
      {/* Top-level Toolset Title */}
      <div className="flex items-center gap-2 mb-2">
        <Layers className="h-5 w-5 text-orange-700" />
        <h1 className="text-lg font-semibold text-gray-900">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group title */}
      <div className="flex items-center gap-2 mb-2">
        <GroupIcon className={cn("h-4 w-4", groupColor)} />
        <span className={cn("font-medium", groupColor)}>{group}</span>
      </div>

      {/* Page title + actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {actions?.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="mt-2 text-sm text-gray-500">
        {breadcrumbs.map((bc, i) => (
          <span key={i}>
            {bc.href ? (
              <Link href={bc.href} className="hover:underline text-blue-600">
                {bc.label}
              </Link>
            ) : (
              bc.label
            )}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </header>
  );
}
