"use client";

import { Layers } from "lucide-react";
import type { Breadcrumb } from "@/components/ui/Breadcrumbs";

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon: React.ReactNode;
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
      {/* Toolset Title */}
      <div className="flex items-center space-x-2 text-[#b7410e] font-semibold">
        <Layers className="w-6 h-6" />
        <span>Shelter and Settlement Severity Classification Toolset</span>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2 mt-1 text-gray-700 font-semibold">
        {groupIcon}
        <span>{group}</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mt-1">{title}</h1>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}

      {/* Breadcrumbs */}
      <nav className="mt-2 text-sm">
        <ol className="flex space-x-1 text-[#b7410e]">
          {breadcrumbs.map((bc, idx) => (
            <li key={idx} className="flex items-center">
              {bc.href && idx < breadcrumbs.length - 1 ? (
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
              ) : (
                <span className="font-semibold">{bc.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <span className="mx-1">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
