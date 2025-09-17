"use client";

interface ToolHeaderProps {
  children?: React.ReactNode;
}

export default function ToolHeader({ children }: ToolHeaderProps) {
  return (
    <header className="space-y-2">
      {/* Global tool title */}
      <h1 className="text-2xl font-bold text-gray-900">
        Shelter and Settlements Severity Classification Toolset
      </h1>
      <p className="text-gray-600 max-w-3xl">
        Welcome to the Shelter and Settlements Severity Classification Toolset (SSC).
        This tool helps configure, manage, and evaluate primary and comprehensive
        frameworks, country datasets, and SSC instances.
      </p>
      {children && <div className="pt-2">{children}</div>}
    </header>
  );
}
