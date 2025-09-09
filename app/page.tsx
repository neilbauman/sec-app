import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="container">
      <h1 className="text-4xl font-black">SSC Dashboard</h1>

      <div className="mt-6 space-y-3">
        <Link href="/admin/framework/primary/editor" className="btn">
          Primary Framework Editor
        </Link>
        <p className="text-sm text-slate-600">
          Manage pillars, themes, and subthemes
        </p>
      </div>
    </main>
  );
}
