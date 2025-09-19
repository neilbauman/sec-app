import React from "react";
import { cn } from "@/lib/utils";
import { toolkit, groups, GroupKey, PageKey } from "@/lib/headerConfig";

export interface PageHeaderProps<G extends GroupKey> {
  group: G;
  page: PageKey<G>;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader<G extends GroupKey>({
  group,
  page,
  breadcrumb,
}: PageHeaderProps<G>) {
  const groupData = groups[group];
  const pageData = groupData.pages[page];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-2">
      {/* Toolkit */}
      <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
        <ToolkitIcon className="w-6 h-6" />
        {toolkit.title}
      </div>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex gap-2 text-sm font-medium text-orange-600">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              ) : (
                crumb.label
              )}
              {i < breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      )}

      {/* Group + Page */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <GroupIcon className={cn("w-6 h-6", groupData.color)} />
        {pageData.title}
      </div>
      <p className="text-gray-600">{pageData.description}</p>
    </div>
  );
}
