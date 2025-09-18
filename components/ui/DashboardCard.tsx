// /components/ui/DashboardCard.tsx
"use client";

import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
};

export default function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  iconColor,
}: DashboardCardProps) {
  return (
    <a
      href={href}
      className="rounded-xl border bg-white p-4 shadow hover:shadow-md transition block"
    >
      <div className={`p-2 rounded-full ${iconColor} w-fit`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
