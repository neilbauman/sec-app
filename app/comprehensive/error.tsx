'use client';

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-700">
        {error.message || 'Unknown error'}
        {error.digest ? ` (digest: ${error.digest})` : ''}
      </p>
      <p className="text-sm text-gray-500">
        If this persists, open <code>/comprehensive/api/list</code> to inspect the raw data.
      </p>
    </main>
  );
}
