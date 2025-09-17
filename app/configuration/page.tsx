"use client";

import Link from "next/link";

export default function SSCConfigurationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SSC Configuration</h1>
      <p className="text-gray-600">
        Manage configuration tools for SSC.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/configuration/primary" className="text-blue-600 hover:underline">
            Primary Framework Editor
          </Link>
        </li>
        <li>
          <Link href="/configuration/comprehensive" className="text-blue-600 hover:underline">
            Comprehensive Framework Editor
          </Link>
        </li>
      </ul>
    </div>
  );
}
