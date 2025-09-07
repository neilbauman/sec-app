// app/framework/page.tsx
import * as React from "react";

export const metadata = {
  title: "Primary Framework Editor",
};

export default function FrameworkPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1
        style={{
          fontSize: 28,
          lineHeight: 1.2,
          margin: 0,
          fontWeight: 600,
        }}
      >
        Primary Framework Editor
      </h1>

      <p style={{ marginTop: 12, color: "#666" }}>
        (Static placeholder – no data fetching, no Supabase, no client code.)
      </p>
    </main>
  );
}
