import Link from "next/link";

export default function FrameworkPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Framework Configuration</h2>
      <p className="text-gray-600">Select an editor below:</p>
      <ul className="list-disc list-inside space-y-2">
        <li><Link href="/framework/primary/editor" className="text-blue-600 hover:underline">Primary Framework Editor</Link></li>
        <li><Link href="/framework/comprehensive/editor" className="text-blue-600 hover:underline">Comprehensive Framework Editor</Link></li>
      </ul>
    </div>
  );
}
