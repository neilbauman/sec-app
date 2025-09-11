// /lib/ui.tsx
import Link from "next/link";
import React from "react";
import { Download, Upload } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind + conditional classes
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple colored tag
 */
export function Tag({
  color,
  children,
}: {
  color: "blue" | "green" | "red";
  children: React.ReactNode;
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  }[color];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        colorMap
      )}
    >
      {children}
    </span>
  );
}

/**
 * Reusable action button with icon
 */
export function ActionIcon({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1 rounded hover:bg-gray-100 text-gray-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

/**
 * Page header with breadcrumb and optional actions
 */
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
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <nav className="text-sm text-gray-500">
          <ol className="flex space-x-2">
            {breadcrumbItems.map((item, idx) => (
              <li key={idx} className="flex items-center">
                {item.href ? (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {idx < breadcrumbItems.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-1 text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
    </div>
  );
}

/**
 * CSV import/export action buttons
 */
export function CsvActions({
  disableImport,
  disableExport,
}: {
  disableImport?: boolean;
  disableExport?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button
        disabled={disableImport}
        className={cn(
          "flex items-center gap-1 rounded-md border px-2 py-1 text-sm",
          disableImport
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "hover:bg-gray-50"
        )}
      >
        <Upload className="h-4 w-4" />
        Import CSV
      </button>
      <button
        disabled={disableExport}
        className={cn(
          "flex items-center gap-1 rounded-md border px-2 py-1 text-sm",
          disableExport
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "hover:bg-gray-50"
        )}
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    </div>
  );
}
