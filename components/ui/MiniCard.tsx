"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type MiniCardProps = {
  title: string;
  href: string;
  icon: LucideIcon;     // 👈 function reference
  iconColor: string;    // Tailwind color class
  description?: string;
};

export default function MiniCard({
  title,
  href,
  icon: Icon,
  iconColor,
  description,
}: MiniCardProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50"
    >
      <div className={`p-2 rounded-md ${iconColor}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </Link>
  );
}
