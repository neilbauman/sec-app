// components/ui/PageHeader.tsx
import { toolkit, groups } from "@/lib/headerConfig";

type PageHeaderProps<G extends keyof typeof groups> = {
  group: G;
  page: keyof (typeof groups)[G]["pages"];
  breadcrumb?: { label: string; href?: string }[];
};

export default function PageHeader<G extends keyof typeof groups>({
  group,
  page,
  breadcrumb,
}: PageHeaderProps<G>) {
  const groupData = groups[group];
  // Explicit cast to avoid the TS indexing complaint
  const pageData = (groupData.pages as Record<string, (typeof groupData)["pages"][keyof typeof groupData["pages"]]>)[
    page as string
  ];

  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="space-y-2">
      {/* Toolkit */}
      <div className="flex items-center gap-2">
        <ToolkitIcon className={`w-6 h-6 ${toolkit.color}`} />
        <h1 className="text-xl font-semibold text-brand-rust">
          {toolkit.title}
        </h1>
      </div>

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="text-sm text-brand-rust flex gap-1">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumb.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      )}

      {/* Group + Page */}
      <div className="flex items-center gap-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className="text-lg font-semibold">{pageData.title}</h2>
      </div>
      <p className="text-gray-600">{pageData.description}</p>
    </div>
  );
}
