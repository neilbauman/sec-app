"use client";

import Link from "next/link";
import { Layers, Settings } from "lucide-react";

export type ToolGroup = "dashboard" | "framework" | "instances" | "configuration";

interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ToolHeaderProps {
  pageTitle: string;
  pageDescription?: string;
  breadcrumbs?: Breadcrumb[];
  group: ToolGroup;
}

const groupConfig: Record<ToolGroup, { icon: JSX.Element; color: string }> = {
  dashboard: { icon: <Layers className="w-6 h-6 text-blue-600" />, color: "text-blue-600" },
  framework: { icon: <Layers className="w-6 h-6 text-purple-600" />, color: "text-purple-600" },
  instances: { icon: <Settings className="w-6 h-6 text-orange-600" />, color: "text-orange-600" },
  configuration: { icon: <Settings className="w-6 h-6 text-green-600" />, color: "text-green-600" },
};

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs,
  group,
}: ToolHeaderProps) {
  const { icon, color } = groupConfig[group];

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex mb-2 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title + Icon */}
      <div className="flex items-center gap-2">
        {icon}
        <h1 className={`text-2xl font-bold ${color}`}>{pageTitle}</h1>
      </div>

      {/* Description */}
      {pageDescription && (
        <p className="text-gray-600 mt-1">{pageDescription}</p>
      )}
    </div>
  );
}
