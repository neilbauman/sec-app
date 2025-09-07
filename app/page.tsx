// app/framework/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primary Framework Editor",
};

export default function Page() {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 600 }}>
        Primary Framework Editor
      </h1>
      <p style={{ marginTop: 8, color: "#6b7280" }}>
        Display-only skeleton. No data calls, no Supabase, no client code.
      </p>
    </div>
  );
}
