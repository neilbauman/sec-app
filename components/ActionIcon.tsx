// components/ActionIcon.tsx
import { type ComponentProps } from "react";

export default function ActionIcon({
  title,
  onClick,
  children,
  disabled,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
