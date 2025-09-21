// components/ui/badge.tsx
import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  let colorClasses = "";

  switch (variant) {
    case "success":
      colorClasses = "bg-green-100 text-green-800 ring-green-200"; // Theme
      break;
    case "danger":
      colorClasses = "bg-red-100 text-red-800 ring-red-200"; // Subtheme
      break;
    case "default":
    default:
      colorClasses = "bg-blue-100 text-blue-800 ring-blue-200"; // Pillar
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}
