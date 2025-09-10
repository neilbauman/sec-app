// lib/ui.tsx
import Link from "next/link";
import { Upload, Download } from "lucide-react";
import * as React from "react";

type BreadcrumbNode =
  | { label: string; href?: string }
  | React.ReactNode;

export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: BreadcrumbNode[] | React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        {/* Global app title */}
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>

        {/* Row: breadcrumb + actions */}
        <div className="flex items-center justify-between">
          <div>
            {/* Breadcrumb */}
            {Array.isArray(breadcrumb) ? (
              <nav aria-label="Breadcrumb" className="mb-1 text-sm text-gray-500">
                <ol className="flex flex-wrap items-center gap-1">
                  {breadcrumb.map((node, idx) => {
                    if (React.isValidElement(node)) return <li key={idx}>{node}</li>;
                    const n = node as Exclude<BreadcrumbNode, React.ReactNode>;
                    const isLast = idx === breadcrumb.length - 1;
                    return (
                      <li key={idx} className="flex items-center gap-1">
                        {n.href && !isLast ? (
                          <Link href={n.href} className="hover:text-gray-700 underline underline-offset-2">
                            {n.label}
                          </Link>
                        ) : (
                          <span className="text-gray-700">{n.label}</span>
                        )}
                        {!isLast && <span className="text-gray-400">/</span>}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : (
              breadcrumb
            )}

            {/* Page title */}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Actions area (e.g., CSV Import/Export) */}
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}

/** Small colored tag used for Pillar/Theme/Subtheme badges */
export function HierTag({
  level,
  className = "",
}: {
  level: "pillar" | "theme" | "subtheme";
  className?: string;
}) {
  const styles =
    level === "pillar"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : level === "theme"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-red-50 text-red-700 ring-red-200";

  const label = level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles} ${className}`}
    >
      {label}
    </span>
  );
}

/** Reusable CSV buttons (placeholders) */
export function CsvActions({
  onImport,
  onExport,
  disabled,
}: {
  onImport?: () => void;
  onExport?: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        title="Import CSV"
        onClick={onImport}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <Upload size={16} />
        Import CSV
      </button>
      <button
        type="button"
        title="Export CSV"
        onClick={onExport}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <Download size={16} />
        Export CSV
      </button>
    </>
  );
}
