import "./globals.css";
import ToolHeader from "@/components/ui/ToolHeader";

export const metadata = {
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
      <body className="bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Global ToolHeader always present */}
          <ToolHeader />

          {/* Page content */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
