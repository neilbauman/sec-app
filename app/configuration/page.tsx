import ToolHeader from "@/components/ui/ToolHeader";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Cog } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks and SSC instances."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Framework Editors Card */}
        <Link href="/configuration/primary">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardHeader className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <CardTitle>Framework Editors</CardTitle>
            </CardHeader>
            <CardContent>
              Manage the Primary and Comprehensive Framework editors.
            </CardContent>
          </Card>
        </Link>

        {/* SSC Instances Card */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-green-600" />
            <CardTitle>SSC Instances</CardTitle>
          </CardHeader>
          <CardContent>
            Manage your SSC instances and configuration details.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
