import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
}
