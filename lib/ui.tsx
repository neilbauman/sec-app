// lib/ui.tsx
import * as React from "react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

/** ----------------------------------------------------------------
 *  Classnames helper (accepts strings OR { "class": boolean } maps)
 *  ---------------------------------------------------------------- */
type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  const parts: string[] = [];
  for (const i of inputs) {
    if (!i) continue;
    if (typeof i === "string" || typeof i === "number") {
      parts.push(String(i));
    } else if (typeof i === "object") {
      for (const [k, v] of Object.entries(i)) if (v) parts.push(k);
    }
  }
  return parts.join(" ");
}

/** ---------------------------------------------------
 *  Small primitives we’ll reuse everywhere
 *  --------------------------------------------------- */
export function Card({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("rounded-2xl border bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("border-b px-4 py-3", className)}>{children}</div>
  );
}

export function CardBody({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}

/** Tag with fixed color palette used in hierarchy */
export function Tag({
  children,
  color = "gray",
  className,
}: React.PropsWithChildren<{
  color?: "blue" | "green" | "red" | "gray";
  className?: string;
}>) {
  const palette: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    gray: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ring-1",
        palette[color],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Monospace “code” chip used to the RIGHT of the tag */
export function CodeChip({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Icon button w/tooltip-friendly wrapper */
export function ActionIcon({
  children,
  className,
  onClick,
  "aria-label": aria,
  disabled,
}: React.PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  disabled?: boolean;
}>) {
  return (
    <button
      type="button"
      aria-label={aria}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-50 disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Ultra-lightweight tooltip (title attribute) */
export function Tooltip({
  content,
  children,
}: React.PropsWithChildren<{ content: string }>) {
  return React.cloneElement(children as React.ReactElement, { title: content });
}

/** CSV action placeholders */
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
      <button
        type="button"
        disabled={disableImport}
        onClick={onImport}
        className="rounded border px-2.5 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        Import CSV
      </button>
      <button
        type="button"
        disabled={disableExport}
        onClick={onExport}
        className="rounded border px-2.5 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        Export CSV
      </button>
    </div>
  );
}

/** Breadcrumb as list of {label, href?} */
export function Breadcrumb({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav className={cn("text-sm text-gray-600", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const node = it.href ? (
            <Link className="hover:underline" href={it.href}>
              {it.label}
            </Link>
          ) : (
            <span className="text-gray-800">{it.label}</span>
          );
        return (
          <li key={`${it.label}-${i}`} className="flex items-center gap-2">
            {node}
            {!last && <span className="text-gray-300">/</span>}
          </li>
        );
        })}
      </ol>
    </nav>
  );
}

/** Shared page header (locks header styles everywhere) */
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

        <div className="flex items-start justify-between gap-3">
          <div>
            {breadcrumb ? <div className="mb-2">{breadcrumb}</div> : null}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

/** Small sort icon (caret stays as-is per your request) */
export function SortIcon({ className }: { className?: string }) {
  return <ArrowUpDown className={cn("h-4 w-4 text-gray-400", className)} />;
}
