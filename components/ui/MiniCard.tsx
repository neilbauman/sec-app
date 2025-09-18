// /components/ui/MiniCard.tsx
"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type MiniCardProps = {
  title: string;
  href: string;
  icon: LucideIcon;      // ✅ keep as a function
  iconColor: string;
};

export default function MiniCard({ title, href, icon: Icon, iconColor }: MiniCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 transition"
    >
      <div className={`p-2 rounded-md ${iconColor}`}>
        <Icon className="w-5 h-5 text-white" />   {/* ✅ render as component */}
      </div>
      <span className="font-medium">{title}</span>
    </Link>
  );
}
