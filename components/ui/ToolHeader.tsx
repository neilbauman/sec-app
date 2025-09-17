"use client";

import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ToolHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function ToolHeader({ title, description, breadcrumbs }: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Title + Description */}
      <div className="flex items-start gap-3 mb-2">
        {/* Logo */}
        <Home className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-gray-500 space-x-1">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center">
              {crumb.href ? (
                <Link href={crumb.href} className="text-blue-600 hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              )}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}
