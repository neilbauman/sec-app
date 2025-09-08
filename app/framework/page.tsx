// app/framework/page.tsx
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Pillar = { code: string; name: string; description?: string; sort_order?: number };
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order?: number };
type SubTheme = { code: string; theme_code: string; name: string; description?: string; sort_order?: number };

async function getData() {
  // Build an absolute base URL so this works on Vercel and locally
  const h = headers();
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/framework/api/list`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load framework list (${res.status})`);
  }
  return (await res.json()) as {
    pillars: Pillar[];
    themes: Theme[];
    subthemes: SubTheme[];
  };
}

export default async function FrameworkPage() {
  const { pillars, themes, subthemes } = await getData();

  // Lazy import of the client-only piece to keep the page itself server-only.
  const Client = (await import('./ClientFrameworkPage')).default;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Primary Framework Editor</h1>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <div className="text-sm text-gray-600">Pillars</div>
          <div className="text-2xl font-semibold">{pillars.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Themes</div>
          <div className="text-2xl font-semibold">{themes.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Sub-themes</div>
          <div className="text-2xl font-semibold">{subthemes.length}</div>
        </div>
      </div>

      <Client pillars={pillars} themes={themes} subthemes={subthemes} />
      <p className="mt-6 text-sm text-gray-600">
        Read-only scaffold. No Supabase or client DB calls here; data comes from <code>/framework/api/list</code>. We’ll
        add editing in small, safe steps next.
      </p>
    </div>
  );
}
