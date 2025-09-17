"use client";

import { Layers } from "lucide-react";

interface ToolHeaderProps {
  pageTitle?: string;
  pageDescription?: string;
}

export default function ToolHeader({ pageTitle, pageDescription }: ToolHeaderProps) {
  return (
    <header className="mb-8 border-b pb-4">
      {/* Global Toolset Title */}
      <div className="flex items-center gap-3 mb-3">
        <Layers className="w-7 h-7 text-blue-600" />
        <h1 className="text-xl font-bold">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>

      {/* Page Title + Description */}
      {pageTitle && (
        <div>
          <h2 className="text-lg font-semibold">{pageTitle}</h2>
          {pageDescription && (
            <p className="text-sm text-gray-600">{pageDescription}</p>
          )}
        </div>
      )}
    </header>
  );
}
