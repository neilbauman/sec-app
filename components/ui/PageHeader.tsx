"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  toolkit: { title: string; icon: ReactNode; color: string };
  group: { name: string; icon: ReactNode; color: string };
  page: { title: string; description: string };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({ toolkit, group, page, breadcrumb }: PageHeaderProps) {
  return (
    <div className="space-y-4 border-b border-gray-200 pb-4">
      {/* Toolkit Title */}
      <div className="flex items-center gap-2">
        {toolkit.icon}
        <h1 className={`text-2xl font-bold ${toolkit.color}`}>{toolkit.title}</h1>
      </div>

      {/* Group and Page */}
      <div className="ml-2 space-y-1">
        <div className="flex items-center gap-2">
          {group.icon}
          <span className={`font-semibold ${group.color}`}>{group.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg flex items-center gap-2">
            {page.title}
          </span>
        </div>
        <p className="text-sm text-gray-600">{page.description}</p>
      </div>

      {/* Breadcrumb */}
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
    </div>
  );
}
