import { ReactNode } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";

export interface PageHeaderProps {
  toolkitTitle: string;
  group: { name: string; icon: ReactNode; color: string };
  page: { title: string; description?: string };
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({
  toolkitTitle,
  group,
  page,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Toolkit title */}
      <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
        <Layers className="w-4 h-4 text-orange-700" />
        {toolkitTitle}
      </div>

      {/* Group */}
      <div className="mt-2 flex items-center gap-2 text-base font-semibold">
        <span className={`${group.color}`}>{group.icon}</span>
        <span className={group.color}>{group.name}</span>
      </div>

      {/* Page title + description */}
      <h1 className="mt-1 text-2xl font-bold">{page.title}</h1>
      {page.description && (
        <p className="text-gray-600">{page.description}</p>
      )}

      {/* Breadcrumb */}
      <div className="mt-2 text-sm text-orange-700">
        {breadcrumb.map((bc, idx) => (
          <span key={idx}>
            {bc.href ? (
              <Link href={bc.href} className="hover:underline">
                {bc.label}
              </Link>
            ) : (
              <span>{bc.label}</span>
            )}
            {idx < breadcrumb.length - 1 && " / "}
          </span>
        ))}
      </div>
    </div>
  );
}
