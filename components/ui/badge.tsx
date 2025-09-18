// /components/ui/badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
          {
            "bg-blue-100 text-blue-800 ring-blue-200": variant === "default",
            "bg-gray-100 text-gray-800 ring-gray-300": variant === "secondary",
            "bg-green-100 text-green-800 ring-green-200": variant === "success",
            "bg-yellow-100 text-yellow-800 ring-yellow-200": variant === "warning",
            "bg-red-100 text-red-800 ring-red-200": variant === "destructive",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

// ✅ export both default and named
export { Badge };
export default Badge;
