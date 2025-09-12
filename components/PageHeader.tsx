import React from "react";
import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export default function PageHeader({
  title,
  breadcrumbItems,
  actions,
}: {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-2 border-b pb-4 mb-6">
      <nav className="text-sm text-gray-500">
        {breadcrumbItems.map((item, i) => (
          <span key={i}>
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {i < breadcrumbItems.length - 1 && " / "}
          </span>
        ))}
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
