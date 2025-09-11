// app/admin/framework/primary/editor/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Editor render error:", error);
  }, [error]);

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
      <h2 className="mb-2 font-semibold">Couldn’t render the Primary Framework Editor</h2>
      <p className="mb-3 text-sm">
        Something went wrong while rendering. Try again, or reload the page.
        {error?.digest ? <span className="ml-1 text-xs text-red-700">Digest: {error.digest}</span> : null}
      </p>
      <button
        onClick={reset}
        className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm hover:bg-red-100"
      >
        Try again
      </button>
    </div>
  );
}
