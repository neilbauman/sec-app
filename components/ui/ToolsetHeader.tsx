// /components/ui/ToolsetHeader.tsx

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: LucideIcon;
  actions?: { label: string }[];   // ✅ only label
};

export function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  icon: GroupIcon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="space-y-4">
      {/* ... same as before ... */}

      {/* Page title + optional actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex gap-2">
            {actions.map((action, i) => (
              <button
                key={i}
                type="button"
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        {breadcrumbs.map((bc, i) => (
          <span key={i}>
            {bc.href ? (
              <a href={bc.href} className="hover:underline">
                {bc.label}
              </a>
            ) : (
              <span>{bc.label}</span>
            )}
            {i < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
    </header>
  );
}
