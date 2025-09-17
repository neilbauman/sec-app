"use client";

import { Layers, Cog, Globe, Database } from "lucide-react";

export type ToolGroup = "ssc" | "framework" | "country" | "instances";

const icons = {
  ssc: <Layers className="w-6 h-6 text-blue-600" />,
  framework: <Cog className="w-6 h-6 text-green-600" />,
  country: <Globe className="w-6 h-6 text-purple-600" />,
  instances: <Database className="w-6 h-6 text-red-600" />,
};

interface ToolHeaderProps {
  pageTitle: string;
  pageDescription: string;
  breadcrumbs: { label: string; href?: string }[];
  group: ToolGroup;
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs,
  group,
}: ToolHeaderProps) {
  return (
    <div className="space-y-2">
      {/* Title + icon */}
      <div className="flex items-center gap-2">
        {icons[group]}
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      {/* Description */}
      <p className="text-gray-600">{pageDescription}</p>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 flex gap-2">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-blue-600 hover:underline"
              >
                {crumb.label}
              </a>
            ) : (
              <span>{crumb.label}</span>
            )}
            {i < breadcrumbs.length - 1 && " › "}
          </span>
        ))}
      </nav>
    </div>
  );
}
