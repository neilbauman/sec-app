// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>SSC</h1>
      <p>This is the temporary home page.</p>
      <p>
        Go to{" "}
        <Link href="/framework" style={{ textDecoration: "underline" }}>
          Primary Framework Editor
        </Link>
      </p>
    </main>
  );
}
