"use client";

import Link from "next/link";

export type PageHeaderProps = {
  title?: string;
  description?: string;
  group?: string;
  page?: string;
  breadcrumb?: { label: string; href?: string }[];
};

export default function PageHeader({
  title,
  description,
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="mb-6 border-b pb-3">
      {/* Breadcrumb navigation */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="text-sm text-gray-500 mb-2">
          {breadcrumb.map((crumb, i) => (
            <span key={i}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                crumb.label
              )}
              {i < breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </nav>
      )}

      {/* Fallback group/page */}
      {!breadcrumb && (group || page) && (
        <div className="text-sm text-gray-500 mb-2">
          {group && <span className="capitalize">{group}</span>}
          {group && page && " / "}
          {page && <span className="capitalize">{page}</span>}
        </div>
      )}

      {/* Heading */}
      {title && <h1 className="text-xl font-semibold">{title}</h1>}
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
