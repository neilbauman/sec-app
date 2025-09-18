// /components/ui/ToolsetHeader.tsx
import { LucideIcon } from "lucide-react";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ToolsetHeaderProps {
  title: string;
  description?: string;
  group: string;
  breadcrumbs: Breadcrumb[];
  icon?: LucideIcon; // ✅ safe type for Lucide icons
  actions?: { label: string }[];
}

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
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6 text-rust-600" />}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{group}</h2>
      {description && <p className="text-gray-600">{description}</p>}

      {/* Breadcrumbs */}
      <nav className="mt-2 text-sm text-gray-500">
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

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="mt-2 flex gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
