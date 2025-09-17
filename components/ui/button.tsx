// components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
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
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-sm rounded-md",
    md: "px-3 py-2 text-base rounded-md",
    lg: "px-4 py-2 text-lg rounded-md",
    icon: "p-2 rounded-full", // ✅ supports icon buttons
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
