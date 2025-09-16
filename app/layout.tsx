import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Shelter and Settlements Severity Classification Toolset",
  description: "Manage frameworks, country datasets, and SSC instances.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
