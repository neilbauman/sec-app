"use client";

import { FC, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string; // ✅ allow subtitle as alias
  actions?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description, subtitle, actions }) => {
  const text = description ?? subtitle; // ✅ prefer description, fallback to subtitle

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        {text && (
          <p className="mt-1 text-sm text-gray-600">{text}</p>
        )}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
