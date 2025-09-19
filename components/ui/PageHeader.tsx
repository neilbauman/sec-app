"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  toolkit: {
    title: string;
    icon: ReactNode;
  };
  group?: {
    name: string;
    icon: ReactNode;
    color: string;
  };
  page?: {
    name: string;
    description?: string;
    icon?: ReactNode;
  };
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkit,
  group,
  page,
  breadcrumb = [],
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Toolkit */}
      <div className="flex items-center gap-2">
        {toolkit.icon}
        <h1 className="text-lg font-semibold text-rust">{toolkit.title}</h1>
      </div>

      {/* Group */}
      {group && (
        <div className="flex items-center gap-2 ml-6">
          {group.icon}
          <span className={`font-semibold ${group.color}`}>{group.name}</span>
        </div>
      )}

      {/* Page */}
      {page && (
        <div className="ml-6">
          <div className="flex items-center gap-2">
            {page.icon}
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {page.name}
            </h2>
          </div>
          {page.description && (
            <p className="text-gray-600">{page.description}</p>
          )}
        </div>
      )}

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="ml-6 flex items-center gap-2 text-sm text-rust font-medium">
          {breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {item.href ? (
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {idx < breadcrumb.length - 1 && <span>›</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
