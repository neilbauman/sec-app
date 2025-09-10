"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // This prints to the Vercel function logs so you can see the actual stack.
    // (Deploy -> Functions -> pick the latest render)
    // eslint-disable-next-line no-console
    console.error("Editor route error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Couldn’t render the Primary Framework Editor
        </h2>
        <p className="text-sm text-red-800">
          {error.message || "An unexpected server error occurred."}
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-red-500">Digest: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-md border px-3 py-1.5 text-sm"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
