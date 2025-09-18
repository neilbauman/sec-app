// /components/ui/Badge.tsx
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "gray";
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-800",
};

export default function Badge({ children, color = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}
