// lib/styles.ts
// Central place for UI classnames so styling doesn't get lost between pages.

export const hierarchyTagClasses: Record<
  "pillar" | "theme" | "subtheme",
  string
> = {
  pillar: "bg-blue-100 text-blue-800 border border-blue-300",
  theme: "bg-green-100 text-green-800 border border-green-300",
  subtheme: "bg-red-100 text-red-800 border border-red-300",
};

// Generic page header (title + app name + optional breadcrumb/actions)
export function PageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500">
          Shelter and Settlements Vulnerability Index
        </div>

        {breadcrumb && (
          <nav className="mb-2 text-sm text-gray-500">{breadcrumb}</nav>
        )}

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
