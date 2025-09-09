'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Log to Vercel function logs / browser console (client boundary)
  console.error('Primary Editor error boundary:', error);
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold mb-3">Something went wrong</h1>
      <p className="mb-4 text-slate-600">
        We hit an error while rendering the Primary Framework Editor.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-slate-900 text-white px-3 py-2"
      >
        Try again
      </button>
    </main>
  );
}
