import Link from "next/link";
import { Layers } from "lucide-react";

export interface ToolHeaderProps {
  pageTitle: string;
  pageDescription?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs,
}: ToolHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Global Tool Title (always present) */}
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="text-sm text-gray-600 flex gap-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Page Title + Description */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{pageTitle}</h2>
        {pageDescription && (
          <p className="text-gray-600 mt-1">{pageDescription}</p>
        )}
      </div>
    </div>
  );
}
