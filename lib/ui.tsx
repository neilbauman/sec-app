// lib/ui.tsx
import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ---------------------------------------------------------
// tiny util
// ---------------------------------------------------------
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------
// Page header (shared across pages)
// ---------------------------------------------------------
type PageHeaderProps = {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50",
      className
    )}>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            {breadcrumb && (
              <div className="text-xs text-gray-500">{breadcrumb}</div>
            )}
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------
// Card (lightweight container)
// ---------------------------------------------------------
type CardProps = React.HTMLAttributes<HTMLDivElement>;
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        className
      )}
    />
  );
}

// ---------------------------------------------------------
// Tag (colored, compact label)
// tone: 'pillar' | 'theme' | 'subtheme' | 'gray'
// ---------------------------------------------------------
type TagProps = {
  tone?: "pillar" | "theme" | "subtheme" | "gray";
  className?: string;
  children: React.ReactNode;
};
export function Tag({ tone = "gray", className, children }: TagProps) {
  const toneClasses =
    tone === "pillar"
      ? "bg-blue-50 text-blue-700 ring-blue-600/20"
      : tone === "theme"
      ? "bg-green-50 text-green-700 ring-green-600/20"
      : tone === "subtheme"
      ? "bg-red-50 text-red-700 ring-red-600/20"
      : "bg-gray-100 text-gray-700 ring-gray-600/10";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneClasses,
        className
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------
// Tooltip (simple: native title attribute for reliability)
// ---------------------------------------------------------
type TooltipProps = {
  label: string;
  children: React.ReactElement;
};
export function Tooltip({ label, children }: TooltipProps) {
  return React.cloneElement(children, { title: label });
}

// ---------------------------------------------------------
// ActionIcon (tiny icon button, tooltip via title)
// ---------------------------------------------------------
type ActionIconProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // accessible name + tooltip
};
export function ActionIcon({ label, className, ...props }: ActionIconProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600",
        "hover:bg-gray-50 hover:text-gray-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    />
  );
}

// ---------------------------------------------------------
// Tiny back link you can use in breadcrumbs if needed
// ---------------------------------------------------------
export function BackTo({ href = "/dashboard", children = "Back to Dashboard" }: { href?: string; children?: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
      <ChevronLeft className="h-4 w-4" aria-hidden />
      {children}
    </Link>
  );
}
