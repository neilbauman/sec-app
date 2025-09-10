// lib/ui.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("rounded-xl border bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Tooltip({
  content,
  children,
  className,
}: {
  content: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Simple title-based tooltip (no external deps)
  return (
    <span className={className} title={content}>
      {children}
    </span>
  );
}

export function ActionIcon({
  onClick,
  "aria-label": ariaLabel,
  children,
  className,
  disabled,
}: {
  onClick?: () => void;
  "aria-label"?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-50 disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function CaretButton({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Collapse" : "Expand"}
      className={clsx("mr-2 inline-flex h-5 w-5 items-center justify-center", className)}
    >
      {/* Keep caret tiny per your request */}
      <span className="block text-gray-500">{open ? "▾" : "▸"}</span>
    </button>
  );
}

/** Tags — fixed colors */
export function TagPillar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200", className)}>
      {children}
    </span>
  );
}
export function TagTheme({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200", className)}>
      {children}
    </span>
  );
}
export function TagSubtheme({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-200", className)}>
      {children}
    </span>
  );
}

/** Page header + breadcrumb (reusable on all pages) */
export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>
        <div className="flex items-center justify-between">
          <div>
            {breadcrumb}
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

export function Breadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("text-sm text-gray-500", className)}>
      <ol className="flex items-center gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center">
              {it.href && !last ? (
                <Link href={it.href} className="hover:text-gray-700">
                  {it.label}
                </Link>
              ) : (
                <span className={clsx(last ? "text-gray-900" : "text-gray-600")}>{it.label}</span>
              )}
              {!last ? <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** CSV placeholders — use disableImport/disableExport instead of `disabled` */
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
    <div className={clsx("flex items-center gap-2", className)}>
      <button
        type="button"
        disabled={disableImport}
        onClick={onImport}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        Import CSV
      </button>
      <button
        type="button"
        disabled={disableExport}
        onClick={onExport}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        Export CSV
      </button>
    </div>
  );
}
