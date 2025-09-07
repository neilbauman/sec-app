// app/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "SSC",
  description: "Social Stability Composite",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
