// components/ui/PageHeader.tsx
import { groups, toolkit } from "@/lib/headerConfig";

interface PageHeaderProps {
  group: keyof typeof groups;
  page: string;
  breadcrumb: { label: string; href?: string }[];
}

export default function PageHeader({ group, page, breadcrumb }: PageHeaderProps) {
  const groupData = groups[group];
  const pageData = groupData.pages[page];
  const ToolkitIcon = toolkit.icon;
  const GroupIcon = groupData.icon;

  return (
    <div className="mb-6 border-b pb-4">
      {/* Toolkit Title */}
      <div className="flex items-center space-x-2 mb-2">
        <ToolkitIcon className={`w-6 h-6 text-brand-rust`} />
        <h1 className="text-xl font-bold text-brand-rust">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Group Title */}
      <div className="flex items-center space-x-2">
        <GroupIcon className={`w-5 h-5 ${groupData.color}`} />
        <h2 className={`text-lg font-semibold ${groupData.color}`}>
          {groupData.name}
        </h2>
      </div>

      {/* Page Title */}
      <h3 className="text-2xl font-bold mt-1">{pageData.title}</h3>

      {/* Breadcrumb with framing */}
      <div className="mt-2 border-t border-b py-2 text-sm">
        <nav className="flex space-x-1">
          {breadcrumb.map((item, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            return (
              <span
                key={idx}
                className={`${
                  isLast ? "font-bold text-brand-rust" : "text-brand-rust"
                }`}
              >
                {item.href ? (
                  <a href={item.href} className="hover:underline">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
                {!isLast && " / "}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
