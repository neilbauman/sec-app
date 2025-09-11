// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shelter and Settlements Vulnerability Index",
  description: "Admin interface for managing the primary framework hierarchy",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="min-h-screen font-sans antialiased text-gray-900">
        {/* App Container */}
        <div className="flex min-h-screen flex-col">
          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
