"use client";

import Breadcrumbs, { Breadcrumb } from "./Breadcrumbs";

export type PageHeaderProps = {
  title?: string;
  description?: string;
  group?: string;
  page?: string;
  breadcrumb?: Breadcrumb[];
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
      {/* Prefer Breadcrumbs component if provided */}
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumbs breadcrumbs={breadcrumb} />
      ) : (
        /* Fallback group/page */
        (group || page) && (
          <div className="text-sm text-gray-500 mb-2">
            {group && <span className="capitalize">{group}</span>}
            {group && page && " / "}
            {page && <span className="capitalize">{page}</span>}
          </div>
        )
      )}

      {/* Heading */}
      {title && <h1 className="text-xl font-semibold">{title}</h1>}
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
