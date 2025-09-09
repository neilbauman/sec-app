import PrimaryFrameworkCards, { Pillar, Theme, Subtheme } from "@/components/PrimaryFrameworkCards";
import { internalGet } from "@/lib/internalFetch";

type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export const dynamic = "force-dynamic";

export default async function PrimaryEditor() {
  let data: FrameworkList | null = null;
  try {
    data = await internalGet<FrameworkList>("/framework/api/list");
  } catch (e) {
    return (
      <main style={{ padding: 24, maxWidth: 1040, margin: "0 auto" }}>
        <a href="/dashboard" style={{ display: "inline-block", marginBottom: 12 }}>← Back to Dashboard</a>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Primary Framework Editor</h1>
        <div style={{ marginTop: 16, color: "#b91c1c" }}>
          Could not load framework list. Ensure NEXT_PUBLIC_BASE_URL is set to your deployment URL.
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 1040, margin: "0 auto" }}>
      <a href="/dashboard" style={{ display: "inline-block", marginBottom: 12 }}>← Back to Dashboard</a>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Primary Framework Editor</h1>
      <p style={{ color: "#6b7280", marginTop: 4 }}>
        Loaded {data.pillars.length} pillar(s), {data.themes.length} theme(s), {data.subthemes.length} subtheme(s).
      </p>

      <div style={{ marginTop: 24 }}>
        <PrimaryFrameworkCards
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>
    </main>
  );
}
