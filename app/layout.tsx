// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "SSC App",
  description: "Severity Scoring Configuration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="mx-auto max-w-6xl p-6">
          <Breadcrumbs />
          {children}
        </main>
      </body>
    </html>
  );
}
