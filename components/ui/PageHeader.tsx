"use client";

import React, { ReactNode } from "react";
import { Layers } from "lucide-react";

export interface PageHeaderProps {
  toolkitTitle?: string;
  group: {
    name: string;
    icon: ReactNode;
    color: string; // Tailwind color class for group (ex: text-green-600)
  };
  page: {
    title: ReactNode; // JSX allowed
    description: string;
    icon?: ReactNode;
  };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkitTitle = "Shelter and Settlement Severity Classification Toolset",
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Toolkit Title */}
      <div className="flex items-center gap-2 text-rust-600 font-semibold">
        <Layers className="w-5 h-5 text-rust-600" />
        <span>{toolkitTitle}</span>
      </div>

      {/* Group Title */}
      <div className="flex items-center gap-2 ml-6">
        <span className={group.color}>{group.icon}</span>
        <span className={`font-semibold ${group.color}`}>{group.name}</span>
      </div>

      {/* Page Title + Description */}
      <div className="ml-10">
        <div className="flex items-center gap-2">
          {page.icon && (
            <span className="text-rust-600">{page.icon}</span>
          )}
          <h1 className="text-2xl font-bold text-rust-600">{page.title}</h1>
        </div>
        {page.description && (
          <p className="text-gray-600 mt-1">{page.description}</p>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="ml-10">
        <nav className="text-sm text-rust-600 flex items-center gap-2">
          {breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {item.href ? (
                <a href={item.href} className="hover:underline text-rust-600">
                  {item.label}
                </a>
              ) : (
                <span className="font-semibold text-rust-600">
                  {item.label}
                </span>
              )}
              {idx < breadcrumb.length - 1 && (
                <span className="text-rust-600">{">"}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
