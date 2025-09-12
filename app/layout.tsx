import "./globals.css";
import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = {
  title: "Shelter and Settlements Severity Index Tool",
  description: "Framework configuration and analysis tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        {/* Top Navbar */}
        <header className="border-b bg-white px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            {/* Logo placeholder */}
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <h1 className="text-lg font-bold">
              Shelter and Settlements Severity Index Tool
            </h1>
          </div>
          {/* Home link */}
          <Link
            href="/"
            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <Home size={16} className="mr-1" /> Dashboard
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer (optional) */}
        <footer className="border-t bg-white p-4 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Shelter and Settlements Severity Index
          Tool
        </footer>
      </body>
    </html>
  );
}
