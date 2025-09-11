import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Shelter and Settlements Severity Index Tool</h1>
          {/* Logo placeholder */}
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
