import ToolHeader from "@/components/ui/ToolHeader";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage and configure frameworks for the SSC Toolset."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/configuration/primary">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold">Primary Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Configure pillars, themes, and sub-themes.
            </p>
          </Card>
        </Link>

        <Link href="/configuration/comprehensive">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold">Comprehensive Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Configure pillars, themes, sub-themes, and indicators.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
