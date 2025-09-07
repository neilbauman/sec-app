// app/framework/page.tsx
import * as React from "react";

// Optional: page title for the browser tab
export const metadata = {
  title: "Primary Framework Editor",
};

export default function FrameworkPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>
        Primary Framework Editor
      </h1>
      <p style={{ marginTop: 8, color: "#6b7280" }}>
        Read-only placeholder. No data is loaded yet.
      </p>
    </div>
  );
}
