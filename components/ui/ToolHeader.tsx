// /components/ui/ToolHeader.tsx

export type ToolHeaderProps = {
  title: string;
  breadcrumbs: { label: string; href: string }[];
  actionButtons?: { label: string; onClick: () => void }[];
};

export function ToolHeader({ title, breadcrumbs, actionButtons }: ToolHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-2 mb-4">
      {/* Title + Breadcrumbs */}
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <nav className="text-sm text-gray-500">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href}>
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
              {i < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
        </nav>
      </div>

      {/* Action buttons (right side) */}
      <div className="flex gap-2">
        {actionButtons?.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
