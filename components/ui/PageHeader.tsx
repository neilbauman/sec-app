// components/ui/PageHeader.tsx
"use client";

import { toolkit, groups } from "@/lib/headerConfig";

type Breadcrumb = { label: string; href?: string };

interface PageHeaderProps<G extends keyof typeof groups> {
  group: G;
  page: keyof (typeof groups)[G]["pages"];
  breadcrumb?: Breadcrumb[];
}

export default function PageHeader<G extends keyof typeof groups>({
  group,
  page,
  breadcrumb,
}: PageHeaderProps<G>) {
  const groupData = groups[group];
  const pageData = groupData.pages[page];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-3">
      {/* Toolkit */}
      <div className="flex items-center gap-2">
        <ToolkitIcon className={`w-7 h-7 ${toolkit.color}`} />
        <h1 className="text-xl font-semibold text-brand-rust">
          {toolkit.title}
        </h1>
      </div>

      {/* Group */}
      <div className="flex items-center gap-2">
        <GroupIcon className={`w-6 h-6 ${groupData.color}`} />
        <h2 className="text-lg font-semibold">{groupData.name}</h2>
      </div>

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="text-sm text-brand-rust flex gap-1">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      )}

      {/* Page */}
      {pageData && (
        <>
          <h3 className="text-md font-semibold text-brand-rust">
            {pageData.title}
          </h3>
          <p className="text-gray-600">{pageData.description}</p>
        </>
      )}
    </div>
  );
}
