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
    <header className="mb-8 border-b border-gray-200 pb-4">
      {/* Top row with Toolkit Title */}
      <div className="flex items-center space-x-3">
        <ToolkitIcon className={`w-8 h-8 ${toolkit.color}`} />
        <h1 className={`text-2xl font-bold ${toolkit.color}`}>
          {toolkit.title}
        </h1>
      </div>

      {/* Group title + icon */}
      <div className="mt-4 flex items-center space-x-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className="text-xl font-semibold">{groupData.name}</h2>
      </div>

      {/* Page title + description */}
      <div className="mt-2">
        <h3 className="text-lg font-bold">{pageData.title}</h3>
        {pageData.description && (
          <p className="text-gray-600">{pageData.description}</p>
        )}
      </div>

      {/* Breadcrumb at the bottom */}
      {breadcrumb.length > 0 && (
        <nav className="mt-4 text-sm text-gray-500 flex flex-wrap gap-1">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:underline"
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  className={
                    idx === breadcrumb.length - 1
                      ? "font-semibold text-brand-rust"
                      : ""
                  }
                >
                  {crumb.label}
                </span>
              )}
              {idx < breadcrumb.length - 1 && (
                <span className="mx-1">/</span>
              )}
            </span>
          ))}
        </nav>
      )}
    </header>
  );
}
