"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// ✅ Map of route segments to human-readable labels
const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  framework: "Framework",
  primary: "Primary Framework",
  editor: "Editor",
  comprehensive: "Comprehensive Framework",
  country: "Country Configuration",
  config: "Configuration",
  instances: "SSC Instances",
  manage: "Manage",
  about: "About",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    // root "/" → show "Dashboard"
    return (
      <nav className="text-sm text-gray-500 mb-4">
        <span>Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = LABELS[segment] || segment; // fallback: raw segment

        return (
          <span key={href} className="flex items-center">
            {!isLast ? (
              <Link href={href} className="hover:text-gray-700">
                {label}
              </Link>
            ) : (
              <span className="text-gray-700">{label}</span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 mx-1" />}
          </span>
        );
      })}
    </nav>
  );
}
