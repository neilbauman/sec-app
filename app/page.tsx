import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      {/* About section */}
      <section>
        <h1 className="text-2xl font-bold mb-2">About</h1>
        <p className="text-gray-600">
          Welcome to the Shelter and Settlements Severity Index Tool. Use this dashboard to manage
          and edit your framework.
        </p>
      </section>

      {/* Framework Editor */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Framework</h2>
        <p className="mb-2 text-gray-600">
          View and edit the full severity framework, including pillars, themes, subthemes, and
          indicators.
        </p>
        <Link
          href="/framework"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Framework Editor
        </Link>
      </section>

      {/* Other Sections */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Other Sections</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Data entry forms</li>
          <li>Analysis tools</li>
          <li>Export options</li>
        </ul>
      </section>
    </div>
  );
}
