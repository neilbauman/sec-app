// /components/ui/ToolHeader.tsx
import React from "react";

export type ToolHeaderProps = {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  group?: string;
  actions?: { label: string; onClick: () => void }[]; // ✅ new
};

export function ToolHeader({
  title,
  breadcrumbs,
  group,
  actions,
}: ToolHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b pb-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {breadcrumbs && (
            <nav className="text-sm text-gray-500 mt-1">
              {breadcrumbs.map((bc, i) => (
                <span key={i}>
                  {i > 0 && " / "}
                  {bc.href ? (
                    <a href={bc.href} className="hover:underline">
                      {bc.label}
                    </a>
                  ) : (
                    bc.label
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={a.onClick}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {group && (
        <div className="text-sm text-gray-400 font-medium uppercase">
          {group}
        </div>
      )}
    </div>
  );
}
