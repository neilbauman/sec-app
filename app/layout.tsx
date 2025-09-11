// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

// ✅ Load Inter font (latin subset for most cases)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEC App",
  description: "Security Framework Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
