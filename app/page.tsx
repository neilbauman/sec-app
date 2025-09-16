import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      {/* About section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Welcome to the Shelter and Settlements Severity Index Tool. Use this dashboard to manage
            and edit your framework.
          </p>
        </CardContent>
      </Card>

      {/* Framework section */}
      <Card>
        <CardHeader>
          <CardTitle>Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            View and edit the full severity framework, including pillars, themes, subthemes, and
            indicators.
          </p>
          <Link
            href="/framework"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Framework Editor
          </Link>
        </CardContent>
      </Card>

      {/* Other sections */}
      <Card>
        <CardHeader>
          <CardTitle>Other Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Data entry forms</li>
            <li>Analysis tools</li>
            <li>Export options</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
