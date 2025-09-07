// Server component on purpose. No hooks, no client, no Supabase.
// We also disable prerendering to avoid the “revalidate is a function” errors.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FrameworkPage() {
  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ margin: 0, fontSize: "28px" }}>Primary Framework Editor</h1>
      <p style={{ marginTop: "12px", color: "#555" }}>
        Read-only placeholder. No data is fetched yet.
      </p>
    </main>
  );
}
