// lib/ui.tsx
"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Upload, Download, Info } from "lucide-react";
import clsx from "clsx";

/** ---------- shell ---------- */
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
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {breadcrumb && (
              <nav className="mb-1 text-xs text-gray-500">
                {breadcrumb}
              </nav>
            )}
            <h1 className="truncate text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

/** ---------- primitives ---------- */
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white shadow-sm",
        className
      )}
      {...rest}
    />
  );
}

export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        className={clsx(
          "pointer-events-none absolute z-20 hidden whitespace-nowrap rounded-md border bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-md group-hover:block",
          side === "top" && "bottom-full mb-1 left-1/2 -translate-x-1/2",
          side === "bottom" && "top-full mt-1 left-1/2 -translate-x-1/2",
          side === "left" && "right-full mr-1 top-1/2 -translate-y-1/2",
          side === "right" && "left-full ml-1 top-1/2 -translate-y-1/2",
        )}
      >
        {content}
      </span>
    </span>
  );
}

export function ActionIcon({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white text-gray-700 hover:bg-gray-50",
          className
        )}
        aria-label={label}
      >
        {children}
      </button>
    </Tooltip>
  );
}

/** Color-coded tag used across pages */
export function Tag({
  children,
  color = "gray",
  className,
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "gray";
  className?: string;
}) {
  const palette = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-300",
  }[color];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1",
        palette,
        className
      )}
    >
      {children}
    </span>
  );
}

/** tiny chevron caret */
export function Caret({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Collapse" : "Expand"}
      className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
    >
      {open ? (
        <ChevronDown className="h-4 w-4 text-gray-600" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-600" />
      )}
    </button>
  );
}

/** CSV placeholders */
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
      <ActionIcon label="Import CSV" onClick={onImport} className={clsx(disableImport && "opacity-50 pointer-events-none")}>
        <Upload className="h-4 w-4" />
      </ActionIcon>
      <ActionIcon label="Export CSV" onClick={onExport} className={clsx(disableExport && "opacity-50 pointer-events-none")}>
        <Download className="h-4 w-4" />
      </ActionIcon>
      <Tooltip content="CSV actions are placeholders for now">
        <Info className="h-4 w-4 text-gray-400" />
      </Tooltip>
    </div>
  );
}
