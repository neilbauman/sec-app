import React from "react";
import { toolkit, groups, GroupKey, PageKey } from "@/lib/headerConfig";

interface PageHeaderProps<G extends GroupKey> {
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
    <div className="border-b border-gray-200 pb-4">
      {/* Toolkit title row */}
      <div className="flex items-center gap-2">
        <ToolkitIcon className={`w-7 h-7 ${toolkit.color}`} />
        <h1 className="text-2xl font-bold text-gray-900">{toolkit.title}</h1>
      </div>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mt-2 text-sm flex gap-2">
          {breadcrumb.map((item, idx) => (
            <span key={idx} className={`${toolkit.color}`}>
              {item.href ? (
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {idx < breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </nav>
      )}

      {/* Group + Page */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <GroupIcon className={`w-6 h-6 ${groupData.color}`} />
          <h2 className="text-xl font-semibold text-gray-900">
            {pageData.title}
          </h2>
        </div>
        {pageData.description && (
          <p className="mt-1 text-gray-600">{pageData.description}</p>
        )}
      </div>
    </div>
  );
}
