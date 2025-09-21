// /components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        rust: "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-300 hover:bg-orange-200",
        // 👇 New badge-like variants
        "badge-blue":
          "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 hover:bg-blue-200",
        "badge-rust":
          "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200 hover:bg-orange-200",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-2 py-1 text-xs",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
