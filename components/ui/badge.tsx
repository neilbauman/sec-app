// /components/ui/badge.tsx
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
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
        variant === "default" && "bg-blue-100 text-blue-800 ring-blue-200",
        variant === "secondary" && "bg-gray-100 text-gray-800 ring-gray-300",
        variant === "success" && "bg-green-100 text-green-800 ring-green-200",
        variant === "warning" && "bg-yellow-100 text-yellow-800 ring-yellow-200",
        variant === "danger" && "bg-red-100 text-red-800 ring-red-200",
        className
      )}
    >
      {children}
    </span>
  );
}
