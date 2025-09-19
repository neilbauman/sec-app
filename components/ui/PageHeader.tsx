"use client";

import { ReactNode } from "react";
import { toolkit, groups } from "@/lib/headerConfig";

interface PageHeaderProps<G extends keyof typeof groups> {
  group: G;
  page: keyof (typeof groups)[G]["pages"];
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader<G extends keyof typeof groups>({
  group,
  page,
  breadcrumb = [],
}: PageHeaderProps<G>) {
  const groupData = groups[group];
  const pageData = groupData.pages[page];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-4">
      {/* Toolkit title */}
      <div className="flex items-center gap-2 font-semibold text-rust">
        <ToolkitIcon className="w-6 h-6" />
        {toolkit.title}
      </div>

      {/* Group title */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <GroupIcon className={`w-6 h-6 ${groupData.color}`} />
        <span className={groupData.color}>{groupData.name}</span>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="text-sm text-rust">
          {breadcrumb.map((item, idx) => (
            <span key={idx}>
              {item.href ? (
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {idx < breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </div>
      )}

      {/* Page title + description */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          {pageData.icon && (
            <pageData.icon className={`w-6 h-6 ${groupData.color}`} />
          )}
          {pageData.title}
        </h1>
        {pageData.description && (
          <p className="mt-1 text-gray-600">{pageData.description}</p>
        )}
      </div>
    </div>
  );
}
