"use client";

import { Layers, Globe, Database, Cog } from "lucide-react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

type ToolGroup = "ssc" | "country" | "instances";

interface ToolHeaderProps {
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Breadcrumb[];
  group?: ToolGroup; // drives icon + accent color
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs = [],
  group = "ssc",
}: ToolHeaderProps) {
  // Icon + color by group
  const groupConfig = {
    ssc: { icon: Cog, color: "text-green-600" },
    country: { icon: Globe, color: "text-purple-600" },
    instances: { icon: Database, color: "text-red-600" },
  }[group];

  const Icon = groupConfig.icon;

  return (
    <div className="mb-6">
      {/* Global SSC Title */}
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

      {/* Page-specific title with group identity */}
      {pageTitle && (
        <div className="mt-6 flex items-center gap-2">
          <Icon className={`h-6 w-6 ${groupConfig.color}`} />
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
        </div>
      )}
      {pageDescription && (
        <p className="text-gray-600 ml-8">{pageDescription}</p>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex gap-1 ml-1">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className={`${
                    idx === 0
                      ? "text-blue-600"
                      : idx === 1
                      ? groupConfig.color
                      : "text-gray-700"
                  } hover:underline`}
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
