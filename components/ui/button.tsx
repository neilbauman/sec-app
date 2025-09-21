// components/ui/button.tsx
type ButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "ghost"; // added ghost
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}: ButtonProps) {
  let variantClasses = "";
  switch (variant) {
    case "outline":
      variantClasses = "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
      break;
    case "destructive":
      variantClasses = "bg-red-600 text-white hover:bg-red-700";
      break;
    case "ghost":
      variantClasses = "bg-transparent text-gray-600 hover:bg-gray-100"; // 👈 ghost style
      break;
    default:
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
      break;
  }

  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "px-2 py-1 text-sm";
      break;
    case "lg":
      sizeClasses = "px-4 py-2 text-lg";
      break;
    default:
      sizeClasses = "px-3 py-2 text-base";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
}
