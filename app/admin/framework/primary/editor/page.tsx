import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkEditor() {
  let data;
  try {
    data = await fetchFrameworkList();
  } catch (err: any) {
    return (
      <main className="container">
        <Link href="/" className="underline">← Back to Dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold">Primary Framework Editor</h1>
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-xl p-4">
          <p className="font-medium">Couldn't load data.</p>
          <p className="text-sm mt-1">{String(err?.message || err)}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/" className="underline">← Back to Dashboard</Link>
      <h1 className="mt-4 text-3xl font-bold">Primary Framework Editor</h1>

      <div className="mt-6">
        <PrimaryFrameworkCards
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>
    </main>
  );
}
