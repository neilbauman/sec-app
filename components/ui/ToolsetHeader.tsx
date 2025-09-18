// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { Breadcrumb } from "@/lib/breadcrumbs";

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  icon?: React.ElementType;
  breadcrumbs: Breadcrumb[];
};

export function ToolsetHeader({ title, description, group, icon: GroupIcon, breadcrumbs }: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset Title */}
      <div className="flex items-center space-x-2 text-rust-600 mb-2">
        <Layers className="w-6 h-6" />
        <h1 className="text-xl font-bold">Shelter and Settlement Severity Classification Toolset</h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2 mb-1">
        {GroupIcon && <GroupIcon className="w-5 h-5 text-gray-600" />}
        <span className="text-lg font-semibold">{group}</span>
      </div>

      {/* Page Title + Description */}
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      {description && <p className="text-gray-600 mb-3">{description}</p>}

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex space-x-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center space-x-1">
            {crumb.icon && <crumb.icon className="w-4 h-4" />}
            <a href={crumb.href} className="hover:underline">{crumb.label}</a>
            {i < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>
    </header>
  );
}
