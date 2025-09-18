// /components/ui/ToolHeader.tsx
import { Breadcrumb } from "@/lib/breadcrumbs";

export interface ToolHeaderProps {
  title: string;
  group: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  actions?: { label: string }[]; // 👈 Add this
}

export function ToolHeader({
  title,
  group,
  description,
  breadcrumbs,
  actions,
}: ToolHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
        <nav className="text-sm mt-1">
          {breadcrumbs.map((bc, i) => (
            <span key={i}>
              <a href={bc.href} className="text-blue-600 hover:underline">
                {bc.label}
              </a>
              {i < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
        </nav>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
