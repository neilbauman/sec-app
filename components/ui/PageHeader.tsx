'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Layers, ChevronRight } from 'lucide-react';

export interface PageHeaderProps {
  toolkitTitle: string;
  group: { name: string; icon: ReactNode; color: string };
  page: { title: string; description?: string };
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
      {/* Context bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-orange-700 font-medium">
          <Layers className="w-4 h-4" />
          {toolkitTitle}
        </div>
        <div className={`flex items-center gap-2 font-semibold ${group.color}`}>
          {group.icon}
          <span>{group.name}</span>
        </div>
      </div>

      {/* Page title + description */}
      <div className="mt-3">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.description && (
          <p className="text-gray-600 mt-1">{page.description}</p>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="mt-3 flex items-center text-sm text-orange-700 space-x-1">
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
