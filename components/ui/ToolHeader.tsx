// /components/ui/ToolHeader.tsx
"use client";

import { Layers, Info, Globe, Database, Settings } from "lucide-react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface ToolHeaderProps {
  title: string;
  description?: string;
  group?: "Configuration" | "Dashboard" | string;
  breadcrumbs?: Breadcrumb[];
  actions?: { label: string; href?: string; onClick?: () => void }[];
}

export function ToolHeader({
  title,
  description,
  group,
  breadcrumbs,
  actions,
}: ToolHeaderProps) {
  const groupConfig: Record<
    string,
    { icon: JSX.Element; color: string; label: string }
  > = {
    Dashboard: {
      icon: <Layers className="w-5 h-5" />,
      color: "text-blue-600",
      label: "Dashboard",
    },
    Configuration: {
      icon: <Settings className="w-5 h-5" />,
      color: "text-emerald-600",
      label: "Configuration",
    },
  };

  const cfg = group ? groupConfig[group] : null;

  return (
    <div className="border-b pb-4 mb-6">
      {cfg && (
        <div className="flex items-center gap-2 mb-2">
          <span className={cfg.color}>{cfg.icon}</span>
          <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="text-sm text-blue-600 mt-2 flex gap-1 flex-wrap">
              {breadcrumbs.map((bc, idx) => (
                <span key={idx}>
                  <Link href={bc.href} className="hover:underline">
                    {bc.label}
                  </Link>
                  {idx < breadcrumbs.length - 1 && " / "}
                </span>
              ))}
            </div>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((a, idx) => (
              <button
                key={idx}
                onClick={a.onClick}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
