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
  breadcrumb,
}: PageHeaderProps<G>) {
  const groupData = groups[group];
  const pageData = groupData.pages[page];

  // ✅ Default breadcrumb always starts at Dashboard
  const defaultBreadcrumb = [
    { label: "Dashboard", href: "/" },
    { label: groupData.name, href: `/${group}` },
    { label: pageData.title },
  ];

  const trail = breadcrumb ?? defaultBreadcrumb;

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-4">
      {/* Toolkit Title */}
      <div className="flex items-center space-x-2">
        <ToolkitIcon className={`w-6 h-6 text-brand-rust`} />
        <h1 className="text-xl font-bold text-brand-rust">
          {toolkit.name}
        </h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className={`text-lg font-semibold ${groupData.color}`}>
          {groupData.name}
        </h2>
      </div>

      {/* Page Title & Description */}
      <div>
        <h3 className="text-xl font-bold">{pageData.title}</h3>
        <p className="text-gray-600">{pageData.description}</p>
      </div>

      {/* Breadcrumb with borders for visual separation */}
      <nav className="text-sm text-brand-rust border-t border-b border-gray-200 py-2">
        {trail.map((crumb, idx) => (
          <span key={idx}>
            {idx > 0 && " / "}
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              <span className="font-semibold">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
