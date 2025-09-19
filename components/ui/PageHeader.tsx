"use client";

import { toolkit, groups } from "@/lib/headerConfig";
import Link from "next/link";

type PageHeaderProps = {
  group: keyof typeof groups;
  page?: string;
  breadcrumb?: { label: string; href?: string }[];
};

export default function PageHeader({ group, page, breadcrumb }: PageHeaderProps) {
  const groupData = groups[group];
  const pageData = page ? groupData.pages?.[page] : null;
  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-4 border-b border-gray-200 pb-4">
      {/* Toolkit Title */}
      <div className="flex items-center gap-2">
        <ToolkitIcon className={`w-7 h-7 ${toolkit.color}`} />
        <h1 className={`text-2xl font-bold ${toolkit.color}`}>{toolkit.title}</h1>
      </div>

      {/* Group */}
      <div className="ml-2 flex items-center gap-2">
        <GroupIcon className={`w-6 h-6 ${groupData.color}`} />
        <span className={`font-semibold ${groupData.color}`}>{groupData.name}</span>
      </div>

      {/* Page */}
      {pageData && (
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            {pageData.icon && <pageData.icon className={`${groupData.color} w-5 h-5`} />}
            {pageData.title}
          </div>
          <p className="text-gray-600">{pageData.description}</p>
        </div>
      )}

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="flex items-center gap-2 text-sm">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className={`${toolkit.color} hover:underline`}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={`font-semibold ${toolkit.color}`}>{crumb.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
