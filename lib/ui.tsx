// /lib/ui.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Download, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------- Tag -------------------- */
export function Tag({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "gray";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        colorClasses[color]
      )}
    >
      {children}
    </span>
  );
}

/* -------------------- Action Icon -------------------- */
export function ActionIcon({
  children,
  title,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

/* -------------------- Page Header -------------------- */
export function PageHeader({
  title,
  breadcrumbItems,
  actions,
}: {
  title: string;
  breadcrumbItems?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <nav className="mt-1 text-sm text-gray-500">
              {breadcrumbItems.map((item, i) => (
                <React.Fragment key={i}>
                  {item.href ? (
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {i < breadcrumbItems.length - 1 && (
                    <span className="mx-1">/</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* -------------------- CSV Actions -------------------- */
export function CsvActions({
  disableImport,
  disableExport,
}: {
  disableImport?: boolean;
  disableExport?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {!disableImport && (
        <button className="btn btn-secondary flex items-center gap-1">
          <Upload className="h-4 w-4" />
          Import CSV
        </button>
      )}
      {!disableExport && (
        <button className="btn btn-primary flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      )}
    </div>
  );
}
