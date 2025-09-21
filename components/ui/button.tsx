import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "destructive" | "ghost" | "primary" | "rust";
  className?: string;
};

export default function Button({
  children,
  onClick,
  size = "md",
  variant = "default",
  className = "",
}: ButtonProps) {
  let baseClasses =
    "inline-flex items-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "px-2 py-1 text-sm";
      break;
    case "lg":
      sizeClasses = "px-4 py-2 text-lg";
      break;
    case "md":
    default:
      sizeClasses = "px-3 py-1.5 text-base";
      break;
  }

  let colorClasses = "";
  switch (variant) {
    case "primary":
      colorClasses =
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      break;
    case "rust":
      colorClasses =
        "bg-orange-700 text-white hover:bg-orange-800 focus:ring-orange-600";
      break;
    case "outline":
      colorClasses =
        "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400";
      break;
    case "destructive":
      colorClasses =
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    case "ghost":
      colorClasses =
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300";
      break;
    case "default":
    default:
      colorClasses =
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
}
