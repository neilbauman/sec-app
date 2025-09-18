// components/ui/ToolsetHeader.tsx
"use client";

import { ReactNode } from "react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon?: ReactNode;         // ✅ accept JSX directly
  icon?: ReactNode;              // ✅ same for page/tool icons
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
      <div className="flex items-center space-x-2 text-rust-600 font-semibold">
        {groupIcon}
        <span>{group}</span>
      </div>
      <h1 className="text-2xl font-bold flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </h1>
      {description && <p className="text-gray-600">{description}</p>}
      <nav className="text-sm mt-2">
        {breadcrumbs.map((bc, i) => (
          <span key={i} className={i === breadcrumbs.length - 1 ? "font-semibold text-rust-600" : "text-rust-600"}>
            {bc.href ? <a href={bc.href}>{bc.label}</a> : bc.label}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </header>
  );
}
