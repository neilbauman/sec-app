// components/ui/PageHeader.tsx
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
  const pageData = groupData.pages[page];
  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      {/* Toolkit title */}
      <div className="flex items-center gap-2 mb-2">
        <ToolkitIcon className="w-7 h-7 text-brand-rust" />
        <h1 className="text-2xl font-bold text-brand-rust">{toolkit.title}</h1>
      </div>

      {/* Group */}
      <div className="flex items-center gap-2 mb-1">
        <GroupIcon className={`w-6 h-6 ${groupData.color}`} />
        <h2 className={`text-xl font-semibold ${groupData.color}`}>
          {groupData.name}
        </h2>
      </div>

      {/* Page */}
      <h3 className="text-lg font-semibold">{pageData.title}</h3>
      <p className="text-gray-600">{pageData.description}</p>

      {/* Breadcrumb */}
      <nav className="mt-3 text-sm flex flex-wrap gap-1">
        <span className="text-brand-rust">Dashboard</span>
        {breadcrumb.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span className="text-gray-400">/</span>
            {idx === breadcrumb.length - 1 ? (
              <span className="font-bold text-brand-rust">{crumb.label}</span>
            ) : crumb.href ? (
              <a href={crumb.href} className="text-brand-rust hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span className="text-brand-rust">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
