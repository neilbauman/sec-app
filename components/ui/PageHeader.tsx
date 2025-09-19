"use client";

import { Layers } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  toolkitTitle?: string; // backward compatibility
  group?: {
    name: ReactNode;
    icon: ReactNode;
    color: string;
  };
  page?: {
    title: ReactNode;
    description?: string;
    icon?: ReactNode;
  };
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkitTitle,
  group,
  page,
  breadcrumb = [],
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Toolkit title (always rust) */}
      <div className="flex items-center gap-2 font-semibold text-rust">
        <Layers className="w-6 h-6 text-rust" />
        <span>
          {toolkitTitle ??
            "Shelter and Settlement Severity Classification Toolset"}
        </span>
      </div>

      {/* Group title */}
      {group && (
        <div className="flex items-center gap-2 ml-2">
          <span className={group.color}>{group.icon}</span>
          <span className={`font-semibold ${group.color}`}>{group.name}</span>
        </div>
      )}

      {/* Page title & description */}
      {page && (
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {page.icon && <span className={group?.color}>{page.icon}</span>}
            {page.title}
          </h1>
          {page.description && (
            <p className="text-gray-600">{page.description}</p>
          )}
        </div>
      )}

      {/* Breadcrumb (always rust) */}
      {breadcrumb.length > 0 && (
        <nav className="text-sm flex gap-2 text-rust">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline text-rust">
                  {crumb.label}
                </a>
              ) : (
                <span className="font-semibold text-rust">{crumb.label}</span>
              )}
              {idx < breadcrumb.length - 1 && <span>&gt;</span>}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}
