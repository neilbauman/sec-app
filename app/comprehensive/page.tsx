// app/comprehensive/page.tsx
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // avoid prerender surprises
export const revalidate = 0;

export default async function ComprehensiveReadOnlyPage() {
  // Use a relative fetch; the API route runs on the same domain
  const res = await fetch('/comprehensive/api/list', { cache: 'no-store' });

  if (!res.ok) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Comprehensive Framework (read-only)</h1>
        <p className="mt-2 text-red-600">Failed to load comprehensive framework data.</p>
        <p className="mt-2 text-sm text-gray-500">
          HTTP {res.status} – {res.statusText}
        </p>
        <p className="mt-4">
          <Link className="underline" href="/framework">
            Back to Primary Framework
          </Link>
        </p>
      </main>
    );
  }

  const payload = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Comprehensive Framework (read-only)</h1>

      <pre className="mt-4 text-sm bg-gray-100 p-4 rounded">
        {JSON.stringify(payload, null, 2)}
      </pre>

      <p className="mt-4">
        <Link className="underline" href="/framework">
          Back to Primary Framework
        </Link>
      </p>
    </main>
  );
}
