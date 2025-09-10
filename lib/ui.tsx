// lib/ui.tsx
"use client";

import Link from "next/link";
import { Info, Upload, Download } from "lucide-react";
import * as React from "react";

// ---------- Small helpers ----------
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Tag (color-coded chips for hierarchy) ----------
type TagColor = "blue" | "green" | "red" | "gray";
export function Tag({
  children,
  color = "gray",
  className,
}: {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
}) {
  const palette: Record<TagColor, string> = {
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-1 ring-green-200",
    red: "bg-red-50 text-red-700 ring-1 ring-red-200",
    gray: "bg-gray-50 text-gray-700 ring-1 ring-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        palette[color],
        className
      )}
    >
      {children}
    </span>
  );
}

// ---------- Simple Card (optional wrapper) ----------
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

// ---------- Tooltip (very small, no portal) ----------
export function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="relative inline-flex">
      <span className="group inline-flex">{children}</span>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block",
          className
        )}
      >
        {label}
      </span>
    </span>
  );
}

// ---------- ActionIcon ----------
export function ActionIcon({
  children,
  onClick,
  "aria-label": ariaLabel,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white text-gray-600 hover:bg-gray-50",
        className
      )}
    >
      {children}
    </button>
  );
}

// ---------- Breadcrumb (rendered from items) ----------
export function Breadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-gray-500", className)}>
      <ol className="flex items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="flex items-center gap-2">
              {it.href && !last ? (
                <Link href={it.href} className="hover:text-gray-700">
                  {it.label}
                </Link>
              ) : (
                <span className="text-gray-700">{it.label}</span>
              )}
              {!last && <span className="text-gray-300">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------- PageHeader (site title + breadcrumb + page title + actions) ----------
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
          <div className="space-y-1">
            {breadcrumb}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

// ---------- CSV Actions (placeholders; wire up later) ----------
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
    <div className={cn("flex items-center gap-2", className)}>
      <ActionIcon
        aria-label="Import CSV"
        onClick={onImport}
        className={disableImport ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Tooltip label="Import CSV">
          <Upload className="h-4 w-4" />
        </Tooltip>
      </ActionIcon>
      <ActionIcon
        aria-label="Export CSV"
        onClick={onExport}
        className={disableExport ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Tooltip label="Export CSV">
          <Download className="h-4 w-4" />
        </Tooltip>
      </ActionIcon>
      <Tooltip label="More info">
        <span className="inline-flex h-8 w-8 items-center justify-center text-gray-400">
          <Info className="h-4 w-4" />
        </span>
      </Tooltip>
    </div>
  );
}
