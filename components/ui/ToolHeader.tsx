// /components/ui/ToolHeader.tsx
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ToolHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  group: "Configuration" | "Instances";
}

export function ToolHeader({ title, description, breadcrumbs, group }: ToolHeaderProps) {
  return (
    <header className="mb-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-2 flex items-center space-x-2">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center space-x-1">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-gray-700 underline">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>

      {/* Title + Group */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          {group}
        </span>
      </div>

      {/* Optional description */}
      {description && (
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
      )}
    </header>
  );
}
