export const metadata = {
  title: "SSC Editor Clean",
  description: "Primary Framework Editor (no auth)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
