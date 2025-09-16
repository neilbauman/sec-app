// components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null; // no breadcrumb on Dashboard

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="mb-6 flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
      <Link href="/" className="hover:underline">
        Dashboard
      </Link>
      {segments.map((segment, idx) => {
        const href = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;

        return (
          <span key={href} className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium capitalize text-gray-900">{segment}</span>
            ) : (
              <Link href={href} className="hover:underline capitalize">
                {segment}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
