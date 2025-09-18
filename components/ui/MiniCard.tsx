// /components/ui/MiniCard.tsx
"use client";

import type { LucideIcon } from "lucide-react";

type MiniCardProps = {
  title: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
};

export default function MiniCard({ title, href, icon: Icon, iconColor }: MiniCardProps) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-gray-50"
    >
      <div className={`p-1 rounded ${iconColor}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium">{title}</span>
    </a>
  );
}
