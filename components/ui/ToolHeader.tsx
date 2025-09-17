// /components/ui/ToolHeader.tsx

import React from "react";
import { cn } from "@/lib/utils";

export interface ToolHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  group: "Configuration" | "Instances";
  description?: string; // ✅ now supported
}

export function ToolHeader({ title, breadcrumbs, group, description }: ToolHeaderProps) {
  return (
    <div className="space-y-2">
      {/* Title */}
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Optional description */}
      {description && <p className="text-gray-600">{description}</p>}

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx}>
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span>{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </div>
  );
}
