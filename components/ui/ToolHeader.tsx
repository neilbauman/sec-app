// /components/ui/ToolHeader.tsx
import Link from "next/link";

export type Breadcrumb = {
  label: string;
  href?: string; // optional for current page
};

export type ToolHeaderProps = {
  title: string;
  breadcrumbs: Breadcrumb[];
  group?: string;
  actionButtons?: { label: string; onClick: () => void }[];
};

export function ToolHeader({ title, breadcrumbs, group, actionButtons }: ToolHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {group && <p className="text-sm text-gray-500">{group}</p>}
          <nav className="mt-1 text-sm text-gray-600">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline text-blue-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && " / "}
              </span>
            ))}
          </nav>
        </div>
        {actionButtons && (
          <div className="flex gap-2">
            {actionButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
