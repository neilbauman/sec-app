import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSC Toolset",
  description: "Shelter and Settlements Severity Classification Toolset",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Each page now controls its own ToolHeader */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
