// components/ui/PageHeader.tsx
import Link from "next/link";
import { groups, toolkit } from "@/lib/headerConfig";

type GroupKey = keyof typeof groups;

type PageHeaderProps = {
  group: GroupKey;
  page: string; // we’ll do a safe lookup at runtime
  breadcrumb?: { label: string; href?: string }[];
};

export default function PageHeader({ group, page, breadcrumb = [] }: PageHeaderProps) {
  const groupData = groups[group];
  const pageData = (groupData.pages as Record<string, { title: string; description?: string }>)[page];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <header className="space-y-2">
      {/* Group row (theme color) */}
      <div className="flex items-center gap-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <span className={`text-base font-semibold ${groupData.color}`}>{groupData.name}</span>
      </div>

      {/* Page title + description */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{pageData?.title ?? ""}</h1>
        {pageData?.description && (
          <p className="mt-1 text-gray-600">{pageData.description}</p>
        )}
      </div>

      {/* Breadcrumb at the bottom */}
      <nav className="pt-1 text-sm">
        <div className="flex items-center gap-1 text-brand-rust">
          {/* Toolkit / home */}
          <ToolkitIcon className="w-4 h-4 text-brand-rust" />
          <Link href="/" className="hover:underline">
            {toolkit.title}
          </Link>
          <span className="px-1">/</span>

          {/* Provided crumbs */}
          {breadcrumb.map((b, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            const baseCls = "hover:underline";
            return b.href && !isLast ? (
              <span key={`${b.label}-${idx}`} className="flex items-center gap-1">
                <Link href={b.href} className={baseCls}>
                  {b.label}
                </Link>
                <span className="px-1">/</span>
              </span>
            ) : (
              <span key={`${b.label}-${idx}`} className={`font-semibold`}>
                {b.label}
              </span>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
