"use client";

import Link from "next/link";
import { Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ToolHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function ToolHeader({
  title,
  description,
  breadcrumbs = [],
}: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Title + Logo */}
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center">
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-blue-600 hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">›</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
