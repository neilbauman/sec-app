import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2 text-lg",
    icon: "p-2 rounded-full", // ✅ fix here
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
