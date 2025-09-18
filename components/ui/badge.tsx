import * as React from "react";
import { cn } from "@/lib/utils";

// Extendable Badge component
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variant === "default" && "bg-gray-100 text-gray-800",
          variant === "secondary" && "bg-blue-100 text-blue-800",
          variant === "outline" && "border border-gray-300 text-gray-700",
          className // ✅ allows custom Tailwind overrides
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
