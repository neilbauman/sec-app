// components/ui/ToolsetHeader.tsx
import { LucideIcon, Layers } from "lucide-react";
import { toolsetGroups } from "@/lib/toolsetGroups";
import { Breadcrumb } from "@/components/ui/Breadcrumbs";

export interface ToolsetHeaderProps {
  title: string;
  description?: string;
  groupKey: keyof typeof toolsetGroups;
  breadcrumbs: Breadcrumb[];
  actions?: { label: string }[];
}

export function ToolsetHeader({
  title,
  description,
  groupKey,
  breadcrumbs,
  actions,
}: ToolsetHeaderProps) {
  const group = toolsetGroups[groupKey];
  const GroupIcon: LucideIcon = group.icon;

  return (
    <header className="mb-6">
      {/* Always Toolset title */}
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <Layers className="h-5 w-5 text-orange-600" />
        Shelter and Settlement Severity Classification Toolset
      </h1>

      {/* Group title themed */}
      <h2 className={`flex items-center gap-2 mt-1 font-semibold ${group.color}`}>
        <GroupIcon className="h-4 w-4" />
        {group.label}
      </h2>

      {/* Page title + description */}
      <div className="mt-2">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Breadcrumbs */}
      <div className="mt-2">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-3 flex gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
