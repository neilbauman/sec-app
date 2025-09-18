// components/ui/ToolsetHeader.tsx
"use client";

import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon?: LucideIcon; // accept component type, not element
  icon?: LucideIcon;
  breadcrumbs?: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon: GroupIcon,
  icon: Icon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {Icon ? <Icon className="w-6 h-6 text-rust-600" /> : <Layers />}
        {title}
      </h1>
      <div className="flex items-center gap-2 mt-1 text-gray-600">
        {GroupIcon && <GroupIcon className="w-5 h-5" />}
        <span className="font-semibold">{group}</span>
      </div>
      {description && (
        <p className="text-gray-500 mt-1 text-sm">{description}</p>
      )}
      {breadcrumbs && (
        <nav className="text-sm mt-2">
          {breadcrumbs.map((bc, idx) => (
            <span key={idx}>
              {idx > 0 && " / "}
              {bc.href ? (
                <a
                  href={bc.href}
                  className={`${
                    idx === breadcrumbs.length - 1
                      ? "font-bold text-rust-600"
                      : "text-rust-600"
                  }`}
                >
                  {bc.label}
                </a>
              ) : (
                <span
                  className={
                    idx === breadcrumbs.length - 1 ? "font-bold text-rust-600" : ""
                  }
                >
                  {bc.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
    </header>
  );
}
