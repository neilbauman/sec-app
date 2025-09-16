import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Breadcrumbs from "@/components/Breadcrumbs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSC App",
  description: "Severity Scoring & Configuration Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="max-w-7xl mx-auto p-6">
          {/* ✅ Shared breadcrumbs on every page */}
          <Breadcrumbs />
          {children}
        </div>
      </body>
    </html>
  );
}
