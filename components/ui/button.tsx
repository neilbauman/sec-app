import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md";
};

export function Button({ variant = "default", size = "md", className = "", ...props }: ButtonProps) {
  const base = "rounded px-3 py-2 font-medium transition";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes: Record<string, string> = {
    sm: "text-sm px-2 py-1",
    md: "text-base",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
