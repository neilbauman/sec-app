"use client";

import { ReactNode } from "react";
import { toolkit, groups } from "@/lib/headerConfig";

export default function PageHeader({
  group,
  page,
  breadcrumb = [],
}: {
  group: keyof typeof groups;
  page: keyof (typeof groups)[typeof group]["pages"];
  breadcrumb?: { label: string; href?: string }[];
}) {
  const ToolkitIcon = toolkit.icon;
  const groupData = groups[group];
  const GroupIcon = groupData.icon;

  const pageData = groupData.pages[page];

  return (
    <div className="space-y-4">
      {/* Toolkit title */}
      <div className="flex items-center gap-2">
        <ToolkitIcon className={`w-7 h-7 ${toolkit.color}`} />
        <h1 className="text-2xl font-bold text-gray-900">{toolkit.title}</h1>
      </div>

      {/* Group */}
      <div className="flex items-center gap-2 ml-6">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className="text-lg font-semibold text-gray-800">{groupData.name}</h2>
      </div>

      {/* Page */}
      <div className="flex items-center gap-2 ml-10">
        <h3 className="text-md font-medium text-gray-700">
          {pageData.title}
        </h3>
      </div>
      <p className="ml-10 text-gray-500">{pageData.description}</p>

      {/* Breadcrumb */}
      <nav className="text-sm">
        <ol className="flex items-center space-x-2 text-orange-600">
          {breadcrumb.map((item, idx) => (
            <li key={idx} className="flex items-center">
              {item.href ? (
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              ) : (
                <span className="font-semibold">{item.label}</span>
              )}
              {idx < breadcrumb.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
