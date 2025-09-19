'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Layers, ChevronRight } from 'lucide-react';

export interface PageHeaderProps {
  toolkitTitle: string;
  group: { name: string; icon: ReactNode; color: string };
  page: { title: string; description?: string; icon?: ReactNode };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkitTitle,
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="mb-6 border-b pb-4">
      {/* Toolkit */}
      <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
        <Layers className="w-4 h-4" />
        {toolkitTitle}
      </div>

      {/* Group */}
      <div className="mt-2 flex items-center gap-2 text-base font-semibold">
        <span className={`${group.color}`}>{group.icon}</span>
        <span className={group.color}>{group.name}</span>
      </div>

      {/* Page title + description */}
      <div className="mt-2">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          {page.icon && <span className="text-gray-700">{page.icon}</span>}
          {page.title}
        </h1>
        {page.description && (
          <p className="text-gray-600 mt-1">{page.description}</p>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 pt-2 border-t text-sm text-orange-700 flex items-center space-x-1">
        {breadcrumb.map((bc, idx) => {
          const isLast = idx === breadcrumb.length - 1;
          return (
            <span key={idx} className="flex items-center gap-1">
              {bc.href && !isLast ? (
                <Link href={bc.href} className="hover:underline">
                  {bc.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-bold' : ''}>{bc.label}</span>
              )}
              {!isLast && (
                <ChevronRight className="w-4 h-4 inline text-orange-700" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
