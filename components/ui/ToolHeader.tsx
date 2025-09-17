// /components/ui/ToolHeader.tsx
"use client";

import { Layers, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolGroup = "Dashboard" | "Configuration" | "Instances";

export interface ToolHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  group: ToolGroup;
}

export function ToolHeader({ title, description, breadcrumbs, group }: ToolHeaderProps) {
  // Map groups to icons + colors
  const groupConfig: Record<ToolGroup, { icon: React.ReactNode; color: string }> = {
    Dashboard: { icon: <Home className="h-6 w-6" />, color: "text-blue-600" },
    Configuration: { icon: <Settings className="h-6 w-6" />, color: "text-green-600" },
    Instances: { icon: <Layers className="h-6 w-6" />, color: "text-purple-600" },
  };

  const { icon, color } = groupConfig[group];

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className={cn("flex items-center justify-center", color)}>{icon}</div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      <nav className="mt-2 text-sm text-gray-500">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx}>
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              crumb.label
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </div>
  );
}
