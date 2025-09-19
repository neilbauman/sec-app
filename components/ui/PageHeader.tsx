// components/ui/PageHeader.tsx
import { toolkit, groups } from "@/lib/headerConfig";

type PageHeaderProps = {
  group: keyof typeof groups;
  page: string;
  breadcrumb?: { label: string; href?: string }[];
};

export default function PageHeader({ group, page, breadcrumb }: PageHeaderProps) {
  const groupData = groups[group];
  const pageData = (groupData.pages as Record<string, { title: string; description: string }>)[page];

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
        <h2 className="text-lg font-semibold">{pageData?.title}</h2>
      </div>
      <p className="text-gray-600">{pageData?.description}</p>
    </div>
  );
}
