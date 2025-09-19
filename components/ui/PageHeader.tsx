// components/ui/PageHeader.tsx
import { groups, toolkit, GroupKey, PageKey } from "@/lib/headerConfig";
import Link from "next/link";

export interface PageHeaderProps<G extends GroupKey> {
  group: G;
  page: PageKey<G>;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader<G extends GroupKey>({
  group,
  page,
  breadcrumb = [],
}: PageHeaderProps<G>) {
  const groupData = groups[group];

  // ✅ Relaxed typing: cast to "any" map for safe indexing
  const pageData =
    (groupData.pages as Record<string, { title: string; description?: string }>)[
      page as string
    ];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="mb-8">
      {/* Toolkit Title */}
      <div className="flex items-center space-x-2">
        <ToolkitIcon className={`w-6 h-6 ${toolkit.color}`} />
        <h1 className={`text-xl font-bold ${toolkit.color}`}>
          {toolkit.title}
        </h1>
      </div>

      {/* Group + Page Title */}
      <div className="mt-4 flex items-center space-x-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className="text-lg font-semibold text-gray-900">
          {pageData?.title}
        </h2>
      </div>
      {pageData?.description && (
        <p className="mt-1 text-gray-600">{pageData.description}</p>
      )}

      {/* Breadcrumb - BELOW */}
      <nav className="mt-4 text-sm">
        <ol className="flex space-x-2 text-gray-600">
          {breadcrumb.map((crumb, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            return (
              <li key={idx} className="flex items-center space-x-2">
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-brand-rust">
                    {crumb.label}
                  </span>
                )}
                {!isLast && <span>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
