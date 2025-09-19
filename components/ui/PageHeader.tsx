// components/ui/PageHeader.tsx
import Link from "next/link";
import { groups, toolkit, GroupKey, PageKey } from "@/lib/headerConfig";

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

  // ✅ Explicit cast fixes the TS error
  const pageData = (groupData.pages as Record<
    string,
    { title: string; description: string }
  >)[page as string];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-2">
      {/* Toolkit Title */}
      <div className="flex items-center space-x-2">
        <ToolkitIcon className={`w-6 h-6 ${toolkit.color}`} />
        <h1 className="text-2xl font-bold">{toolkit.title}</h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className="text-xl font-semibold">{groupData.name}</h2>
      </div>

      {/* Page Title */}
      <h3 className="text-lg font-medium">{pageData.title}</h3>

      {/* Breadcrumb */}
      <nav className="text-sm text-brand-rust">
        {[
          { label: "Dashboard", href: "/" },
          ...breadcrumb,
          { label: pageData.title },
        ].map((crumb, idx, arr) => (
          <span key={idx}>
            {idx > 0 && " / "}
            {idx === arr.length - 1 ? (
              <span className="font-bold">{crumb.label}</span>
            ) : crumb.href ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              crumb.label
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
