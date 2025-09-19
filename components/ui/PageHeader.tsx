"use client";

import { Layers } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  group: {
    name: ReactNode; // allow string or JSX
    icon: ReactNode;
    color: string;
  };
  page: {
    title: ReactNode; // allow string or JSX
    description: string;
    icon?: ReactNode;
  };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Toolkit title */}
      <div className="flex items-center gap-2 text-rust font-semibold">
        <Layers className="w-6 h-6 text-rust" />
        <span>Shelter and Settlement Severity Classification Toolset</span>
      </div>

      {/* Group title */}
      <div className="flex items-center gap-2 ml-2">
        <span className={group.color}>{group.icon}</span>
        <span className={`font-semibold ${group.color}`}>{group.name}</span>
      </div>

      {/* Page title & description */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {page.icon && <span className={group.color}>{page.icon}</span>}
          {page.title}
        </h1>
        <p className="text-gray-600">{page.description}</p>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm flex gap-2 text-rust">
        {breadcrumb.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span className="font-semibold">{crumb.label}</span>
            )}
            {idx < breadcrumb.length - 1 && <span>&gt;</span>}
          </span>
        ))}
      </nav>
    </div>
  );
}
