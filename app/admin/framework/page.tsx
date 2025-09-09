import Link from "next/link";
import { internalGet } from "@/lib/internalFetch";

type FrameworkList = {
  pillars: { code: string; name: string }[];
  themes: { code: string; name: string; pillar: string }[];
  subthemes: { code: string; name: string; theme: string }[];
};

export const dynamic = "force-dynamic";

export default async function FrameworkLanding() {
  let data: FrameworkList | null = null;
  try {
    data = await internalGet<FrameworkList>("/framework/api/list");
  } catch (e) {
    // show friendly error on page
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Framework</h1>
      <p style={{ color: "#6b7280", marginTop: 4 }}>
        {data ? `Loaded ${data.pillars.length} pillar(s), ${data.themes.length} theme(s).` : "API not reachable yet."}
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <Link href="/admin/framework/primary/editor" style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          Open Primary Framework Editor
        </Link>
      </div>
    </main>
  );
}
