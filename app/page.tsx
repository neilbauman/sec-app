// app/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Settings, Globe, Layers } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Shelter and Settlements Severity Index Tool</h1>

      {/* About */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome to the Shelter and Settlements Severity Index Tool. Use this
            dashboard to manage and edit your framework.
          </p>
        </CardContent>
      </Card>

      {/* SSC Configuration */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-500" />
          <CardTitle>SSC Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/framework/primary"
            className="block text-blue-600 hover:underline"
          >
            Primary Framework Editor
          </Link>
          <Link
            href="/framework/comprehensive"
            className="block text-blue-600 hover:underline"
          >
            Comprehensive Framework Editor
          </Link>
        </CardContent>
      </Card>

      {/* Country Configuration */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          <CardTitle>Country Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/country" className="text-blue-600 hover:underline">
            Manage Country Data
          </Link>
        </CardContent>
      </Card>

      {/* Manage SSC Instances */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-500" />
          <CardTitle>SSC Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/instances" className="text-blue-600 hover:underline">
            Manage SSC Instances
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
