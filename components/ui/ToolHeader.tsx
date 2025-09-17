"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Layers, Cog } from "lucide-react";

export type ToolGroup = "dashboard" | "configuration";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ToolHeaderProps {
  pageTitle: string;
  pageDescription?: string;
  breadcrumbs?: Breadcrumb[];
  group: ToolGroup;
}

const groupIcons: Record<ToolGroup, JSX.Element> = {
  dashboard: <Layers className="h-6 w-6 text-blue-600" />,
  configuration: <Cog className="h-6 w-6 text-green-600" />,
};

export function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs = [],
  group,
}: ToolHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center space-x-3">
        {groupIcons[group]}
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      {pageDescription && (
        <p className="mt-1 text-sm text-gray-600">{pageDescription}</p>
      )}
      {breadcrumbs.length > 0 && (
        <nav className="mt-2 text-sm text-gray-500">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}
