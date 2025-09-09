export const metadata = { title: "SSC", description: "SSC Admin" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>{children}</div>
      </body>
    </html>
  );
}
