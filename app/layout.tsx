import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEC App",
  description: "Sustainability Evaluation and Configuration Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page-specific ToolHeader is rendered inside each page */}
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
