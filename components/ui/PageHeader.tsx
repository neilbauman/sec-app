"use client";

import { ReactNode } from "react";

export interface PageHeaderProps {
  toolkitTitle: string;
  group: {
    name: string;
    icon: ReactNode;
    color: string;
  };
  page: {
    title: string | ReactNode; // ✅ allow ReactNode here
    description: string;
  };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkitTitle,
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      {/* Toolkit Title */}
      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        {group.icon}
        <span>{toolkitTitle}</span>
      </div>

      {/* Group */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {group.icon}
        <span className={group.color}>{group.name}</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
        {page.title}
      </h1>

      {/* Page Description */}
      <p className="text-sm text-gray-600">{page.description}</p>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        {breadcrumb.map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} className="text-orange-700 hover:underline">
                {item.label}
              </a>
            ) : (
              <span className="font-semibold text-orange-700">
                {item.label}
              </span>
            )}
            {idx < breadcrumb.length - 1 && (
              <span className="text-gray-400">›</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
