// components/ui/ToolHeader.tsx
"use client";

import { ReactNode } from "react";

interface ToolHeaderProps {
  children?: ReactNode;
}

export default function ToolHeader({ children }: ToolHeaderProps) {
  return (
    <div className="mb-6">
      {/* Global app title */}
      <h1 className="text-2xl font-bold text-gray-900">
        Shelter and Settlements Severity Classification Toolset
      </h1>
      <p className="text-gray-600 mb-4">
        Welcome to the Shelter and Settlements Severity Classification Toolset
        (SSC). This tool helps configure, manage, and evaluate primary and
        comprehensive frameworks, country datasets, and SSC instances.
      </p>

      {/* Page-specific section */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
