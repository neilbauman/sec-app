// /lib/ui.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Info, Download, Upload } from "lucide-react";

/** Tailwind class combiner */
export function cn(
  ...inputs: Array<
    string | number | false | null | undefined | Record<string, boolean>
  >
): string {
  const out: string[] = [];
  for (const i of inputs) {
    if (!i) continue;
    if (typeof i === "string" || typeof i === "number") {
      out.push(String(i));
      continue;
    }
    for (const [k, v] of Object.entries(i)) {
      if (v) out.push(k);
    }
  }
  return out.join(" ");
}

/** Color-coded label (Pillar, Theme, Subtheme) */
export function Tag({
  children,
  color = "gray",
  className,
  title,
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "gray";
  className?: string;
  title?: string;
}) {
  const palettes: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-300",
  };
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1",
        palettes[color],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Small icon button */
export function ActionIcon({
  onClick,
  className,
  title,
  disabled,
  children,
}: {
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Tooltip */
export function Tooltip({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-block">
      <span className="peer inline-block">{children}</span>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border bg-white px-2 py-1 text-xs text-gray-700 shadow",
          "opacity-0 transition-opacity duration-150 peer-hover:opacity-100"
        )}
      >
        {content}
      </span>
    </span>
  );
}

/** Breadcrumb */
export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="flex items-center gap-1">
            {it.href ? (
              <Link href={it.href} className="hover:text-gray-700 hover:underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-gray-700">{it.label}</span>
            )}
            {i < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Page header */
export function PageHeader({
  title,
  breadcrumbItems,
  actions,
}: {
  title: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 mb-6 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            {breadcrumbItems && breadcrumbItems.length > 0 && (
              <div className="mb-1">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

/** CSV Import/Export placeholder */
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
        title="Import CSV (placeholder)"
        onClick={onImport}
        disabled={disableImport}
      >
        <Upload className="h-4 w-4" />
      </ActionIcon>
      <ActionIcon
        title="Export CSV (placeholder)"
        onClick={onExport}
        disabled={disableExport}
      >
        <Download className="h-4 w-4" />
      </ActionIcon>
    </div>
  );
}

/** Info tooltip icon */
export function InfoIcon({ tip }: { tip: string }) {
  return (
    <Tooltip content={tip}>
      <span className="inline-flex">
        <Info className="h-4 w-4 text-gray-400" />
      </span>
    </Tooltip>
  );
}
