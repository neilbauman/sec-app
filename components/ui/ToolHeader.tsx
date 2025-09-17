"use client";

import { Layers } from "lucide-react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface ToolHeaderProps {
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs = [],
}: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Global Title */}
      <div className="flex items-center gap-2">
        <Layers className="h-7 w-7 text-blue-600" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>
      <p className="text-gray-600 mt-1">
        Welcome to the Shelter and Settlements Severity Classification Toolset
        (SSC). This tool helps configure, manage, and evaluate primary and
        comprehensive frameworks, country datasets, and SSC instances.
      </p>

      {/* Page-specific title */}
      {pageTitle && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
          {pageDescription && (
            <p className="text-gray-600">{pageDescription}</p>
          )}
        </div>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex gap-1">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
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
              {idx < breadcrumbs.length - 1 && <span>›</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
