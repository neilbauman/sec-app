// /lib/ui.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Download, Upload } from "lucide-react";
import React from "react";

// ----------------------------------------------------
// Page Header with Breadcrumb + optional actions
// ----------------------------------------------------
export function PageHeader({
  title,
  breadcrumbItems,
  actions,
}: {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-4 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Left: Breadcrumb + title */}
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right: Actions (export, import, etc.) */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

// ----------------------------------------------------
// Breadcrumbs
// ----------------------------------------------------
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:underline text-blue-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ----------------------------------------------------
// Tag (colored labels for Pillar / Theme / Subtheme)
// ----------------------------------------------------
export function Tag({
  color = "gray",
  children,
}: {
  color?: "blue" | "green" | "red" | "gray";
  children: React.ReactNode;
}) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return <span className={cn(base, colors[color])}>{children}</span>;
}

// ----------------------------------------------------
// Icon Button for Actions (edit, delete, add...)
// ----------------------------------------------------
export function ActionIcon({
  title,
  children,
  onClick,
  disabled,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded p-1 hover:bg-gray-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

// ----------------------------------------------------
// CSV Import/Export (placeholder)
// ----------------------------------------------------
export function CsvActions({
  disableImport,
  disableExport,
}: {
  disableImport?: boolean;
  disableExport?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {!disableImport && (
        <ActionIcon title="Import CSV" disabled>
          <Upload className="h-4 w-4 text-gray-500" />
        </ActionIcon>
      )}
      {!disableExport && (
        <ActionIcon title="Export CSV" disabled>
          <Download className="h-4 w-4 text-gray-500" />
        </ActionIcon>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Utility: cn (conditional classNames)
// ----------------------------------------------------
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
