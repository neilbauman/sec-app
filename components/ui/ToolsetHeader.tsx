// /components/ui/ToolsetHeader.tsx
import { LucideIcon } from "lucide-react";
import type { Breadcrumb } from "@/lib/breadcrumbs";

export type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: LucideIcon;
  actions?: { label: string }[]; // ✅ safe, just labels
};

export function ToolsetHeader({
  title,
  description,
  group,
  breadcrumbs,
  icon: Icon,
  actions,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      {/* Toolset title */}
      <div className="flex items-center space-x-2 text-rust-600 mb-2">
        {Icon && <Icon className="w-6 h-6" />}
        <h1 className="text-xl font-bold">Shelter and Settlement Severity Classification Toolset</h1>
      </div>

      {/* Group & page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{group}</h2>
          <h3 className="text-2xl font-bold">{title}</h3>
          {description && <p className="text-gray-600">{description}</p>}
        </div>

        {/* Optional action buttons */}
        {actions && actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((a, i) => (
              <button
                key={i}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="mt-2 text-sm text-gray-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {i > 0 && " / "}
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline">
                {crumb.label}
              </a>
            ) : (
              crumb.label
            )}
          </span>
        ))}
      </nav>
    </header>
  );
}
