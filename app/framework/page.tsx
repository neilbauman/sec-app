// app/framework/page.tsx
// NOTE: Intentionally a SERVER component with no 'use client', no dynamic/revalidate exports.

export const metadata = {
  title: "Primary Framework Editor",
};

export default function FrameworkPage() {
  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: 24, margin: 0, fontWeight: 600 }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: "#666", marginTop: 8 }}>
        (Static placeholder – no data fetching or actions yet.)
      </p>
    </main>
  );
}
