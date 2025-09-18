// /components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Breadcrumb = { label: string; href?: string };

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon: LucideIcon;
  breadcrumbs: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon: GroupIcon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center space-x-2 text-rust-600">
        <Layers className="w-6 h-6" />
        <h1 className="text-xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>
      <div className="mt-1 flex items-center space-x-2 text-gray-700">
        <GroupIcon className="w-5 h-5" />
        <span className="font-semibold">{group}</span>
      </div>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      <nav className="mt-2 text-sm">
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={idx}>
              {bc.href && !isLast ? (
                <a href={bc.href} className="text-rust-600 hover:underline">
                  {bc.label}
                </a>
              ) : (
                <span
                  className={`${
                    isLast
                      ? "text-rust-600 font-bold"
                      : "text-rust-600"
                  }`}
                >
                  {bc.label}
                </span>
              )}
              {idx < breadcrumbs.length - 1 && " / "}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
