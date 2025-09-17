"use client";

import { Layers } from "lucide-react";

interface ToolHeaderProps {
  title?: string;
  description?: string;
}

export default function ToolHeader({ title, description }: ToolHeaderProps) {
  return (
    <div className="mb-6 border-b pb-4">
      {/* Global Toolset Title */}
      <div className="flex items-center gap-3 mb-3">
        <Layers className="w-7 h-7 text-blue-600" />
        <h1 className="text-xl font-bold">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>

      {/* Page Title + Description */}
      {title && (
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
