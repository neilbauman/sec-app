// /components/ui/badge.tsx
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        {
          "bg-blue-100 text-blue-800 ring-blue-200": variant === "default", // Pillar
          "bg-green-100 text-green-800 ring-green-200": variant === "success", // Theme
          "bg-red-100 text-red-800 ring-red-200": variant === "danger", // Subtheme
        },
        className
      )}
    >
      {children}
    </span>
  );
}
