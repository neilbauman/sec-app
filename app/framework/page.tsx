// app/framework/page.tsx
export default function FrameworkPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <p className="mt-2 text-sm text-gray-600">
        Read-only view. Pulls pillars → themes → subthemes from Supabase via a server API route.
      </p>

      {/* Client side fetch + render */}
      {/* @ts-expect-error Async/Client boundary is fine here */}
      <FrameworkClient />
    </div>
  );
}

// Import placed at bottom to keep the server file simple
import FrameworkClient from './FrameworkClient';
