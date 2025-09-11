// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shelter and Settlements Vulnerability Index",
  description: "Admin and framework management for the SSVI platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gray-50 antialiased">
        {/* Global wrapper */}
        <div className="flex min-h-dvh flex-col">
          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t bg-white py-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Shelter and Settlements Vulnerability Index
          </footer>
        </div>
      </body>
    </html>
  );
}
