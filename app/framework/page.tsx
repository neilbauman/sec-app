// app/framework/page.tsx
import Link from "next/link";

export default function FrameworkPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Framework</h1>
      <ul className="space-y-2">
        <li>
          <Link
            href="/framework/primary/editor"
            className="text-blue-600 hover:underline"
          >
            Primary Framework Editor
          </Link>
        </li>
      </ul>
    </main>
  );
}
