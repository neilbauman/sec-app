"use client";

import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";

export interface Breadcrumb {
  label: string;
  href?: string; // href is now optional
}

interface ToolHeaderProps {
  pageTitle: string;
  pageDescription: string;
  breadcrumbs?: Breadcrumb[];
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs = [],
}: ToolHeaderProps) {
  return (
    <header className="mb-6">
      {/* Title with icon */}
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      {/* Description */}
      {pageDescription && (
        <p className="text-gray-600 mb-4">{pageDescription}</p>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {crumb.href && i !== breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500">{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
}
