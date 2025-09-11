import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Framework Configuration</h3>
          <p className="text-sm text-gray-500 mb-4">Manage the structure and details of the framework.</p>
          <div className="space-y-2">
            <Link href="/framework/primary/editor" className="text-blue-600 hover:underline">Primary Framework Editor</Link><br/>
            <Link href="/framework/comprehensive/editor" className="text-blue-600 hover:underline">Comprehensive Framework Editor</Link>
          </div>
        </div>
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Country Configuration</h3>
          <p className="text-sm text-gray-500">Coming soon — configure countries in the system.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">SSC Instance Management</h3>
          <p className="text-sm text-gray-500">Coming soon — manage SSC instances.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-500">Learn more about this tool and its purpose.</p>
          <Link href="/about" className="text-blue-600 hover:underline">About Page</Link>
        </div>
      </div>
    </div>
  );
}
