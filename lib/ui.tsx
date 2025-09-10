// lib/ui.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Upload, Download } from 'lucide-react';

/** Simple utility to merge class names */
export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

/** Page header (global) */
export function PageHeader({
  title,
  breadcrumb,
  actions,
  className,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50', className)}>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {breadcrumb && <div className="mb-1 text-sm text-gray-500">{breadcrumb}</div>}
            <h1 className="truncate text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

/** Small pill tag used in hierarchy rows */
export function Tag({
  children,
  color = 'gray',
  className,
}: {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'gray';
  className?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    gray: 'bg-gray-100 text-gray-700 ring-gray-200',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Tiny icon button used for row actions */
export function ActionIcon({
  children,
  title,
  onClick,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        className
      )}
    >
      {children}
    </button>
  );
}

/** Very light wrapper so we don’t pull another lib just for tooltips */
export function Tooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      <span className="sr-only">{content}</span>
      {children}
      <span
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
        aria-hidden="true"
      >
        {content}
      </span>
    </span>
  );
}

/** Lightweight card (kept so older imports don’t break) */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

/** CSV placeholders for header actions */
export function CsvActions({
  onImport,
  onExport,
  disableImport,
  disableExport,
  className,
}: {
  onImport?: () => void;
  onExport?: () => void;
  disableImport?: boolean;
  disableExport?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ActionIcon title="Import CSV" onClick={onImport} className={disableImport ? 'opacity-50 pointer-events-none' : ''}>
        <Upload className="h-4 w-4" />
      </ActionIcon>
      <ActionIcon title="Export CSV" onClick={onExport} className={disableExport ? 'opacity-50 pointer-events-none' : ''}>
        <Download className="h-4 w-4" />
      </ActionIcon>
    </div>
  );
}

/** Standard breadcrumb helper (optional) */
export function Crumb({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-sm text-blue-600 hover:underline">
      {children}
    </Link>
  );
}
