// app/framework/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Pillar = { id: string; code?: string | null; name?: string | null; description?: string | null };
type Theme = { id: string; pillar_id: string; code?: string | null; name?: string | null; description?: string | null };
type Subtheme = { id: string; theme_id: string; code?: string | null; name?: string | null; description?: string | null };

async function getData(): Promise<{ pillars: Pillar[]; themes: Theme[]; subthemes: Subtheme[] }> {
  try {
    // Relative fetch to your route handler; no caching so it won’t be used at build time.
    const res = await fetch('/framework/api/list', { cache: 'no-store', next: { revalidate: 0 } });
    if (!res.ok) return { pillars: [], themes: [], subthemes: [] };

    const raw = await res.json();

    // Support both shapes: { pillars, themes, subthemes }  OR  [pillars, themes, subthemes]
    if (Array.isArray(raw)) {
      const [pillars = [], themes = [], subthemes = []] = raw as [Pillar[]?, Theme[]?, Subtheme[]?];
      return { pillars, themes, subthemes };
    } else if (raw && typeof raw === 'object') {
      const {
        pillars = [],
        themes = [],
        subthemes = [],
      } = raw as { pillars?: Pillar[]; themes?: Theme[]; subthemes?: Subtheme[] };
      return { pillars, themes, subthemes };
    }

    return { pillars: [], themes: [], subthemes: [] };
  } catch {
    // Be completely defensive; never let the page crash at build or runtime.
    return { pillars: [], themes: [], subthemes: [] };
  }
}

export default async function FrameworkPage() {
  const { pillars, themes, subthemes } = await getData();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Primary Framework Editor</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Pillars</div>
          <div className="text-2xl font-bold">{pillars.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Themes</div>
          <div className="text-2xl font-bold">{themes.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Sub-themes</div>
          <div className="text-2xl font-bold">{subthemes.length}</div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Read-only scaffold. No Supabase or client hooks here; data comes from <code>/framework/api/list</code>. We’ll
        layer interactivity later.
      </p>
    </main>
  );
}
