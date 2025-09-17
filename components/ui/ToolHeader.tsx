import React from "react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ToolHeaderProps {
  title: string;
  group: "Configuration" | "Instances"; // ✅ consistent usage
  breadcrumbs: Breadcrumb[]; // ✅ always required
  description?: string; // ✅ optional, only when needed
}

export function ToolHeader({ title, group, breadcrumbs, description }: ToolHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold flex items-center space-x-2">
        <span>{title}</span>
      </h1>
      <nav className="text-sm text-gray-500 mt-1">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              crumb.label
            )}
            {index < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
}
