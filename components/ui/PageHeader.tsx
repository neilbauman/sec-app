"use client";

import { toolkit, groups } from "@/lib/headerConfig";

type PageHeaderProps = {
  group: keyof typeof groups;
  page?: string;
};

export default function PageHeader({ group, page }: PageHeaderProps) {
  const groupData = groups[group];
  const pageData = page ? groupData.pages?.[page] : null;

  return (
    <div className="space-y-3">
      {/* Toolkit */}
      <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
        {toolkit.icon}
        {toolkit.title}
      </div>

      {/* Group */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        {groupData.icon}
        <span className={groupData.color}>{groupData.name}</span>
      </div>

      {/* Page */}
      {pageData && (
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            {pageData.icon}
            {pageData.title}
          </div>
          <p className="text-gray-600">{pageData.description}</p>
        </div>
      )}
    </div>
  );
}
