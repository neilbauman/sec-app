// lib/ui.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // if you don't have a cn util, replace cn(...) with template strings

/** Global app header used across pages */
export function AppHeader({
  breadcrumb,
  title,
  actions,
}: {
  breadcrumb?: Array<{ href?: string; label: string }>;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-2 flex items-center gap-1 text-sm text-gray-500">
            {breadcrumb.map((b, i) => (
              <span key={`${b.label}-${i}`} className="flex items-center gap-1">
                {b.href ? (
                  <Link className="hover:text-gray-700" href={b.href}>
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-gray-700">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <ChevronRight className="h-4 w-4 opacity-70" />
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

/** Page container for consistent max width & padding */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 pb-10">{children}</div>;
}

/** Color-coded hierarchy tag */
export function HierTag({
  level, // "pillar" | "theme" | "subtheme"
  className,
}: {
  level: "pillar" | "theme" | "subtheme";
  className?: string;
}) {
  const palette =
    level === "pillar"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : level === "theme"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-red-50 text-red-700 ring-red-200";

  const label =
    level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        palette,
        className
      )}
    >
      {label}
    </span>
  );
}

/** Icon button with tooltip (Lucide icon passed as child) */
export function IconButton({
  label,
  onClick,
  children,
  className,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}
