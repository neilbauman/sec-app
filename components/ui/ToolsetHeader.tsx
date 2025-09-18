"use client";

import { Layers } from "lucide-react";
import type { ReactNode } from "react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon?: ReactNode;
  icon?: ReactNode;
  breadcrumbs: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon,
  icon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-[#B7410E]" /> {/* Rust */}
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>
      <div className="flex items-center gap-2 mt-1 text-lg font-semibold">
        {groupIcon}
        <span>{group}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 text-base font-medium">
        {icon}
        <span>{title}</span>
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <nav className="mt-2 text-sm flex gap-2">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-[#B7410E] hover:underline"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="font-bold text-[#B7410E]">{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>
    </header>
  );
}
