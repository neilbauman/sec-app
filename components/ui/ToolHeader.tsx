"use client";

import { Layers, Cog, Globe, Server } from "lucide-react";

export type ToolGroup = "dashboard" | "configuration" | "country" | "instances";

interface ToolHeaderProps {
  pageTitle: string;
  pageDescription: string;
  breadcrumbs: { label: string; href?: string }[];
  group: ToolGroup;
}

export function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs,
  group,
}: ToolHeaderProps) {
  const iconMap: Record<ToolGroup, JSX.Element> = {
    dashboard: <Layers className="h-6 w-6 text-blue-600" />,
    configuration: <Cog className="h-6 w-6 text-green-600" />,
    country: <Globe className="h-6 w-6 text-purple-600" />,
    instances: <Server className="h-6 w-6 text-red-600" />,
  };

  return (
    <div className="space-y-2">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 flex space-x-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center space-x-1">
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span>{crumb.label}</span>
            )}
            {i < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="flex items-center space-x-2">
        {iconMap[group]}
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      {/* Description */}
      <p className="text-gray-600">{pageDescription}</p>
    </div>
  );
}
